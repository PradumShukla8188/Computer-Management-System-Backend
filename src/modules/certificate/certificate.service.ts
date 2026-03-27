import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import {
    CertificateSearchType,
    CreateCertificateTemplateDto,
    IssueCertificateDto,
    SearchCertificateDto,
    UpdateCertificateTemplateDto,
} from './certificate.dto';
import { CertificateTemplate, IssuedCertificate, Student, StudentMark } from 'src/models';
import {
    DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE,
    DEFAULT_SST_CERTIFICATE_TEMPLATE,
    DEFAULT_SST_CERTIFICATE_TEMPLATE_NAME,
} from './default-certificate-template';

@Injectable()
export class CertificateService {
    constructor(
        @InjectModel(CertificateTemplate.name)
        private readonly certificateTemplateModel: Model<any>,
        @InjectModel(IssuedCertificate.name)
        private readonly issuedCertificateModel: Model<any>,
        @InjectModel(Student.name)
        private readonly studentModel: Model<any>,
        @InjectModel(StudentMark.name)
        private readonly studentMarkModel: Model<any>,
    ) { }

    async createTemplate(dto: CreateCertificateTemplateDto) {
        const payload = {
            name: dto.name,
            design: dto.design || [],
            dimensions: dto.dimensions || { width: 1123, height: 794 },
            backgroundImage: dto.backgroundImage,
            isActive: dto.isActive ?? true,
        };

        const template = await this.certificateTemplateModel.create(payload);
        return {
            success: true,
            message: 'Certificate template created successfully',
            data: template,
        };
    }

    async getTemplates() {
        await this.ensureDefaultTemplate();
        const templates = await this.certificateTemplateModel.find().sort({ createdAt: -1 });
        return {
            success: true,
            data: templates,
        };
    }

    async updateTemplate(id: string, dto: UpdateCertificateTemplateDto) {
        const template = await this.certificateTemplateModel.findByIdAndUpdate(
            id,
            {
                ...dto,
                ...(dto.design ? { design: dto.design } : {}),
                ...(dto.dimensions ? { dimensions: dto.dimensions } : {}),
            },
            { new: true },
        );

        if (!template) {
            throw new NotFoundException('Certificate template not found');
        }

        return {
            success: true,
            message: 'Certificate template updated successfully',
            data: template,
        };
    }

    async deleteTemplate(id: string) {
        const template = await this.certificateTemplateModel.findByIdAndDelete(id);

        if (!template) {
            throw new NotFoundException('Certificate template not found');
        }

        return {
            success: true,
            message: 'Certificate template deleted successfully',
        };
    }

    async issueCertificate(dto: IssueCertificateDto, issuedBy?: string) {
        await this.ensureDefaultTemplate();
        const student = await this.studentModel.findById(dto.studentId).populate('courseId');
        if (!student) {
            throw new NotFoundException('Student not found');
        }

        const publishedMarksCount = await this.studentMarkModel.countDocuments({
            studentId: new mongoose.Types.ObjectId(dto.studentId),
            isPublished: true,
        });
        if (!publishedMarksCount) {
            throw new BadRequestException('Certificate can only be issued after published marks are added for this student');
        }

        const template = await this.certificateTemplateModel.findById(dto.templateId);
        if (!template) {
            throw new NotFoundException('Certificate template not found');
        }

        const certificateNumber = await this.generateCertificateNumber();
        const mergedData = {
            ...this.buildDefaultCertificateData(student),
            ...(dto.data || {}),
        };
        mergedData.certificate_number = certificateNumber;
        mergedData.issue_date = this.formatDate(new Date());
        mergedData.date = mergedData.issue_date;
        mergedData.qr_code = this.buildCertificateQrCode(mergedData);

        const issuedCertificate = await this.issuedCertificateModel.create({
            certificateNumber,
            studentId: new mongoose.Types.ObjectId(dto.studentId),
            templateId: new mongoose.Types.ObjectId(dto.templateId),
            data: mergedData,
            issuedAt: new Date(),
            ...(issuedBy ? { issuedBy: new mongoose.Types.ObjectId(issuedBy) } : {}),
        });

        return {
            success: true,
            message: 'Certificate issued successfully',
            data: issuedCertificate,
        };
    }

    async getIssuedCertificates() {
        const issued = await this.issuedCertificateModel
            .find()
            .populate({
                path: 'studentId',
                populate: { path: 'courseId', select: 'name shortName' },
            })
            .populate('templateId')
            .sort({ createdAt: -1 });

        return {
            success: true,
            data: issued,
        };
    }

    async getEligibleStudents() {
        const studentIds = await this.studentMarkModel.distinct('studentId', { isPublished: true });

        if (!studentIds.length) {
            return {
                success: true,
                data: [],
            };
        }

        const students = await this.studentModel
            .find({ _id: { $in: studentIds }, deletedAt: null })
            .populate('courseId')
            .sort({ createdAt: -1 })
            .lean();

        const issuedStudentIds = await this.issuedCertificateModel.distinct('studentId');
        const issuedSet = new Set(issuedStudentIds.map((id: any) => id.toString()));

        return {
            success: true,
            data: students.map((student: any) => ({
                ...student,
                hasIssuedCertificate: issuedSet.has(student._id.toString()),
            })),
        };
    }

    async searchPublicCertificates(query: SearchCertificateDto) {
        const searchType = query.searchType || CertificateSearchType.Roll;
        const cleaned = query.search.trim();

        const studentFilter: any = { deletedAt: null };
        if (searchType === CertificateSearchType.Roll) {
            studentFilter.rollNo = { $regex: `^${this.escapeRegex(cleaned)}$`, $options: 'i' };
        } else {
            studentFilter.name = { $regex: this.escapeRegex(cleaned), $options: 'i' };
        }

        const students = await this.studentModel
            .find(studentFilter)
            .populate('courseId')
            .sort({ createdAt: -1 })
            .limit(searchType === CertificateSearchType.Roll ? 1 : 20)
            .lean();

        if (!students.length) {
            return {
                success: true,
                data: [],
                message: 'No student found',
            };
        }

        const result = await Promise.all(
            students.map(async (student: any) => {
                const latestCertificate = await this.issuedCertificateModel
                    .findOne({ studentId: student._id })
                    .populate('templateId')
                    .sort({ issuedAt: -1 })
                    .lean();

                return {
                    student,
                    certificate: latestCertificate,
                };
            }),
        );

        return {
            success: true,
            data: result,
        };
    }

    async buildCertificatePdf(issuedCertificateId: string) {
        const issuedCertificate: any = await this.issuedCertificateModel
            .findById(issuedCertificateId)
            .populate('templateId')
            .populate({
                path: 'studentId',
                populate: { path: 'courseId', select: 'name shortName' },
            })
            .lean();

        if (!issuedCertificate) {
            throw new NotFoundException('Issued certificate not found');
        }

        const buffer = await this.renderCertificatePdf(issuedCertificate);

        return {
            fileName: `${issuedCertificate.certificateNumber || 'certificate'}.pdf`,
            buffer,
        };
    }

    private async renderCertificatePdf(issuedCertificate: any): Promise<Buffer> {
        const template = issuedCertificate.templateId;
        if (!template) {
            throw new BadRequestException('Template not found for issued certificate');
        }

        const width = template?.dimensions?.width || 1123;
        const height = template?.dimensions?.height || 794;

        const doc = new PDFDocument({
            size: [width, height],
            margin: 0,
            info: {
                Title: issuedCertificate?.certificateNumber || 'Certificate',
                Author: 'Computer Management System',
            },
        });

        const dataChunks: Buffer[] = [];

        return new Promise<Buffer>(async (resolve, reject) => {
            doc.on('data', (chunk) => dataChunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(dataChunks)));
            doc.on('error', (err) => reject(err));

            const dataMap = {
                ...this.buildDefaultCertificateData(issuedCertificate.studentId),
                ...(issuedCertificate.data || {}),
                certificate_number: issuedCertificate.certificateNumber,
                issue_date: this.formatDate(issuedCertificate.issuedAt || issuedCertificate.createdAt),
            };

            if (template.backgroundImage) {
                const bgBuffer = await this.loadAssetBuffer(template.backgroundImage);
                if (bgBuffer) {
                    doc.image(bgBuffer, 0, 0, { width, height });
                }
            }

            const designElements = Array.isArray(template.design) ? template.design : [];
            for (const element of designElements) {
                if (!element || typeof element !== 'object') {
                    continue;
                }

                if (element.type === 'text') {
                    const x = Number(element.x) || 0;
                    const y = Number(element.y) || 0;
                    const fontSize = Number(element.fontSize) || 16;
                    const color = element.fill || '#000000';
                    const font = String(element.fontWeight || '').toLowerCase().includes('bold')
                        ? 'Helvetica-Bold'
                        : 'Helvetica';
                    const interpolated = this.interpolateTemplateText(String(element.text || ''), dataMap);

                    doc.fillColor(color);
                    doc.font(font);
                    doc.fontSize(fontSize);
                    doc.text(interpolated, x, y, {
                        lineBreak: false,
                    });
                }

                if (element.type === 'image' && element.src) {
                    const src = this.interpolateTemplateText(String(element.src), dataMap);
                    const x = Number(element.x) || 0;
                    const y = Number(element.y) || 0;
                    const widthValue = Number(element.width) || undefined;
                    const heightValue = Number(element.height) || undefined;

                    const imageBuffer = await this.loadAssetBuffer(src);
                    if (imageBuffer) {
                        doc.image(imageBuffer, x, y, {
                            ...(widthValue ? { width: widthValue } : {}),
                            ...(heightValue ? { height: heightValue } : {}),
                        });
                    }
                }
            }

            doc.end();
        });
    }

    private buildDefaultCertificateData(student: any): Record<string, string> {
        if (!student) {
            return {};
        }

        const issueDate = this.formatDate(new Date());
        const studentName = student?.name || '';
        const fatherName = student?.fatherName || '';
        const motherName = student?.motherName || '';
        const rollNo = student?.rollNo || '';
        const courseName = student?.courseId?.name || student?.courseName || '';
        const duration = student?.courseDuration || '';
        const dateOfBirth = student?.dob ? this.formatDate(student.dob) : '';
        const session = student?.session || '';

        const baseData = {
            student_name: studentName,
            student_full_name: studentName,
            name: studentName,
            father_name: fatherName,
            mother_name: motherName,
            date_of_birth: dateOfBirth,
            dob: dateOfBirth,
            course_name: courseName,
            course: courseName,
            duration,
            roll_no: rollNo,
            roll_number: rollNo,
            registration_number: rollNo,
            certificate_number: '',
            session,
            date: issueDate,
            issue_date: issueDate,
            student_photo: student?.studentPhoto || '',
            institute_name: 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
            institute_address: 'Dikunni Dhikunni, Uttar Pradesh 241203',
            institute_contact: '9519222486, 7376486686',
        };

        return {
            ...baseData,
            qr_code: this.buildCertificateQrCode(baseData),
        };
    }

    private interpolateTemplateText(templateText: string, data: Record<string, any>) {
        return templateText.replace(/\{\{\s*(.*?)\s*\}\}/g, (_, key) => {
            const value = data[key];
            if (value === null || value === undefined) {
                return '';
            }
            return String(value);
        });
    }

    private buildCertificateQrCode(data: Record<string, any>) {
        const qrText = [
            'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
            `Certificate No: ${data?.certificate_number || ''}`,
            `Student: ${data?.student_full_name || data?.student_name || data?.name || ''}`,
            `Father: ${data?.father_name || ''}`,
            `Course: ${data?.course_name || data?.course || ''}`,
            `Roll No: ${data?.roll_no || data?.roll_number || ''}`,
            `Registration No: ${data?.registration_number || ''}`,
            `Issue Date: ${data?.issue_date || data?.date || ''}`,
        ]
            .filter(Boolean)
            .join('\n');

        return `https://quickchart.io/qr?size=170&margin=1&text=${encodeURIComponent(qrText)}`;
    }

    private async loadAssetBuffer(assetPath: string): Promise<Buffer | null> {
        if (!assetPath) {
            return null;
        }

        if (assetPath.startsWith('data:image')) {
            const base64 = assetPath.split(',')[1];
            if (!base64) {
                return null;
            }
            return Buffer.from(base64, 'base64');
        }

        if (/^https?:\/\//i.test(assetPath)) {
            try {
                const response = await fetch(assetPath);
                if (!response.ok) {
                    return null;
                }
                const arrayBuffer = await response.arrayBuffer();
                return Buffer.from(arrayBuffer);
            } catch {
                return null;
            }
        }

        const cleaned = assetPath.replace(/^\/+/, '');
        const possiblePaths = [
            path.join(process.cwd(), cleaned),
            path.join(process.cwd(), 'uploads', cleaned.replace(/^uploads\//, '')),
            path.join(process.cwd(), '..', 'Computer-Management-System', 'public', cleaned),
            path.join(process.cwd(), '..', 'Student-Panel-CMS', 'public', cleaned),
        ];

        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                return fs.readFileSync(filePath);
            }
        }

        return null;
    }

    private async generateCertificateNumber(): Promise<string> {
        let unique = false;
        let certificateNumber = '';

        while (!unique) {
            const random = Math.floor(1000 + Math.random() * 9000);
            const datePart = this.formatDate(new Date()).replace(/-/g, '');
            certificateNumber = `CERT-${datePart}-${random}`;

            const exists = await this.issuedCertificateModel.findOne({ certificateNumber }).lean();
            unique = !exists;
        }

        return certificateNumber;
    }

    private formatDate(value: Date | string) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    private escapeRegex(value: string) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private async ensureDefaultTemplate() {
        const templates = [DEFAULT_SST_CERTIFICATE_TEMPLATE, DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE];
        let defaultTemplate: any = null;

        for (const template of templates) {
            const existing = await this.certificateTemplateModel.findOne({
                name: template.name,
            }).lean();

            if (existing) {
                if (template.name === DEFAULT_SST_CERTIFICATE_TEMPLATE_NAME) {
                    defaultTemplate = existing;
                }
                continue;
            }

            const created = await this.certificateTemplateModel.create(template);
            if (template.name === DEFAULT_SST_CERTIFICATE_TEMPLATE_NAME) {
                defaultTemplate = created;
            }
        }

        return defaultTemplate;
    }
}

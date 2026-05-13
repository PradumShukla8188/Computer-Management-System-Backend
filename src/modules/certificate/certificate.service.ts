import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import PDFDocument = require('pdfkit');
import sharp from 'sharp';
import {
    CertificateData,
    SVG_CERT_HEIGHT,
    SVG_CERT_WIDTH,
    renderCertificateAsPng,
} from './certificate-svg-renderer';
import {
    CertificateSearchType,
    CreateCertificateTemplateDto,
    IssueCertificateDto,
    SearchCertificateDto,
    UpdateCertificateTemplateDto,
} from './certificate.dto';
import { CertificateTemplate, IssuedCertificate, Student, StudentMark } from 'src/models';
import {
    ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE,
    ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE_NAME,
    ADVANCED_SST_CERTIFICATE_TEMPLATE,
    ADVANCED_SST_CERTIFICATE_TEMPLATE_NAME,
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
        const mergedData: any = {
            ...this.buildDefaultCertificateData(student),
            ...(dto.data || {}),
            ...(dto.grade ? { grade: dto.grade } : {}),
            ...(dto.securedPercent ? { secured_percent: dto.securedPercent } : {}),
        };
        mergedData.certificate_number = certificateNumber;
        mergedData.certificate_no = certificateNumber;
        mergedData.issue_date = this.formatDate(new Date());
        mergedData.date = mergedData.issue_date;
        mergedData.qr_code = this.buildCertificateQrCode(mergedData);

        const issuedCertificate = await this.issuedCertificateModel.create({
            certificateNumber,
            studentId: new mongoose.Types.ObjectId(dto.studentId),
            templateId: new mongoose.Types.ObjectId(dto.templateId),
            data: mergedData,
            grade: dto.grade,
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

        const data = await Promise.all(
            students.map(async (student: any) => {
                const marks = await this.studentMarkModel.find({
                    studentId: student._id,
                    isPublished: true,
                }).lean();

                let securedPercent = 0;
                if (marks.length > 0) {
                    const totalObtained = marks.reduce((sum, m) => sum + (Number(m.obtainedMarks) || 0), 0);
                    const totalMax = marks.reduce((sum, m) => sum + (Number(m.totalMarks) || 0), 0);
                    securedPercent = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
                }

                return {
                    ...student,
                    securedPercent,
                    hasIssuedCertificate: issuedSet.has(student._id.toString()),
                };
            }),
        );

        return {
            success: true,
            data,
        };
    }

    async searchPublicCertificates(query: SearchCertificateDto) {
        const searchType = query.searchType || CertificateSearchType.Roll;
        const cleaned = query.search?.trim() || '';

        const studentFilter: any = { deletedAt: null };

        if (query.studentName) {
            studentFilter.name = { $regex: this.escapeRegex(query.studentName.trim()), $options: 'i' };
        }

        if (query.dob) {
            // DOB is stored as Date in Student model usually, or string if formatted.
            // Let's assume it might need parsing or matching.
            // We'll check both if needed, but for now simple match if it's a string.
            studentFilter.$or = [
                { dob: query.dob },
                { dob: new Date(query.dob.split('-').reverse().join('-')) }
            ];
        }

        if (searchType === CertificateSearchType.Roll || searchType === CertificateSearchType.Enrollment) {
            studentFilter.rollNo = { $regex: `^${this.escapeRegex(cleaned)}$`, $options: 'i' };
        }

        let students: any[] = [];

        if (searchType === CertificateSearchType.CertificateNo) {
            const cert: any = await this.issuedCertificateModel
                .findOne({ certificateNumber: cleaned })
                .populate({
                    path: 'studentId',
                    populate: { path: 'courseId' }
                })
                .populate('templateId')
                .lean();

            if (cert && cert.studentId) {
                // If DOB or Name was provided, verify it matches
                let match = true;
                const student: any = cert.studentId;
                if (query.studentName && !student.name.toLowerCase().includes(query.studentName.toLowerCase().trim())) {
                    match = false;
                }
                if (query.dob) {
                    const studentDob = this.formatDate(student.dob);
                    if (studentDob !== query.dob) {
                        match = false;
                    }
                }

                if (match) {
                    return {
                        success: true,
                        data: [{
                            student: cert.studentId,
                            certificate: cert,
                        }],
                    };
                }
            }

            return { success: true, data: [], message: 'No certificate found' };
        }

        students = await this.studentModel
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

                // Fetch published marks for marksheet support
                const marks = await this.studentMarkModel
                    .find({ studentId: student._id, isPublished: true })
                    .populate('subjectId', 'title')
                    .sort({ createdAt: 1 })
                    .lean();

                let marksheet: any = null;
                if (marks.length > 0) {
                    const totalObtained = marks.reduce((sum: number, m: any) => sum + (Number(m.obtainedMarks) || 0), 0);
                    const totalMax = marks.reduce((sum: number, m: any) => sum + (Number(m.totalMarks) || 0), 0);
                    const percentageValue = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

                    marksheet = {
                        examName: marks[0]?.examName || 'Examination',
                        totalObtained,
                        totalMax,
                        percentage: percentageValue.toFixed(2),
                        grade: this.calculateGrade(percentageValue),
                        subjects: marks.map((m: any) => ({
                            title: m.subjectId?.title || 'Subject',
                            totalMarks: m.totalMarks,
                            obtainedMarks: m.obtainedMarks,
                        })),
                        issueDate: this.formatDate(marks[marks.length - 1]?.createdAt || new Date()),
                    };
                }

                return {
                    student,
                    certificate: latestCertificate,
                    marksheet,
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

        // Route advanced templates through the SVG → PNG → PDF pipeline
        const advancedNames: string[] = [
            ADVANCED_SST_CERTIFICATE_TEMPLATE_NAME,
            ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE_NAME,
        ];
        if (
            advancedNames.includes(template.name) || 
            template.name.toLowerCase().includes('advanced')
        ) {
            return this.renderAdvancedCertificatePdf(issuedCertificate);
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
                certificate_no: issuedCertificate.certificateNumber,
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

                // ── text ──────────────────────────────────────────────────────
                if (element.type === 'text') {
                    const x = Number(element.x) || 0;
                    const y = Number(element.y) || 0;
                    const fontSize = Number(element.fontSize) || 16;
                    const color = element.fill || '#000000';
                    const elementWidth = element.width !== undefined ? Number(element.width) : undefined;
                    const align: 'left' | 'center' | 'right' = element.align || 'left';

                    // Font: explicit fontFamily → bold → default
                    let font = 'Helvetica';
                    if (element.fontFamily) {
                        font = String(element.fontFamily);
                    } else if (String(element.fontWeight || '').toLowerCase().includes('bold')) {
                        font = 'Helvetica-Bold';
                    }

                    const interpolated = this.interpolateTemplateText(String(element.text || ''), dataMap);

                    doc.fillColor(color).font(font).fontSize(fontSize);

                    if (elementWidth !== undefined) {
                        doc.text(interpolated, x, y, { lineBreak: false, width: elementWidth, align });
                    } else {
                        doc.text(interpolated, x, y, { lineBreak: false });
                    }
                }

                // ── image ─────────────────────────────────────────────────────
                if (element.type === 'image' && element.src) {
                    const src = this.interpolateTemplateText(String(element.src), dataMap);
                    const x = Number(element.x) || 0;
                    const y = Number(element.y) || 0;
                    const widthValue = element.width ? Number(element.width) : undefined;
                    const heightValue = element.height ? Number(element.height) : undefined;

                    const imageBuffer = await this.loadAssetBuffer(src);
                    if (imageBuffer) {
                        doc.image(imageBuffer, x, y, {
                            ...(widthValue ? { width: widthValue } : {}),
                            ...(heightValue ? { height: heightValue } : {}),
                        });
                    }
                }

                // ── rect ──────────────────────────────────────────────────────
                if (element.type === 'rect') {
                    const x = Number(element.x) || 0;
                    const y = Number(element.y) || 0;
                    const w = Number(element.width) || 0;
                    const h = Number(element.height) || 0;
                    const fillColor: string | null = element.fill || null;
                    const strokeColor: string | null = element.stroke || null;
                    const strokeWidth = Number(element.strokeWidth) || 1;
                    const radius = Number(element.radius) || 0;
                    const opacity = element.opacity !== undefined ? Number(element.opacity) : 1;

                    doc.save();
                    if (opacity < 1) doc.opacity(opacity);
                    if (radius > 0) {
                        doc.roundedRect(x, y, w, h, radius);
                    } else {
                        doc.rect(x, y, w, h);
                    }
                    if (fillColor && strokeColor) {
                        doc.lineWidth(strokeWidth).fillAndStroke(fillColor, strokeColor);
                    } else if (fillColor) {
                        doc.fill(fillColor);
                    } else if (strokeColor) {
                        doc.lineWidth(strokeWidth).stroke(strokeColor);
                    }
                    doc.restore();
                }

                // ── circle ────────────────────────────────────────────────────
                if (element.type === 'circle') {
                    const cx = Number(element.cx) || 0;
                    const cy = Number(element.cy) || 0;
                    const r = Number(element.r) || 0;
                    const fillColor: string | null = element.fill || null;
                    const strokeColor: string | null = element.stroke || null;
                    const strokeWidth = Number(element.strokeWidth) || 1;
                    const opacity = element.opacity !== undefined ? Number(element.opacity) : 1;

                    doc.save();
                    if (opacity < 1) doc.opacity(opacity);
                    doc.circle(cx, cy, r);
                    if (fillColor && strokeColor) {
                        doc.lineWidth(strokeWidth).fillAndStroke(fillColor, strokeColor);
                    } else if (fillColor) {
                        doc.fill(fillColor);
                    } else if (strokeColor) {
                        doc.lineWidth(strokeWidth).stroke(strokeColor);
                    }
                    doc.restore();
                }

                // ── line ──────────────────────────────────────────────────────
                if (element.type === 'line') {
                    const x1 = Number(element.x1) || 0;
                    const y1 = Number(element.y1) || 0;
                    const x2 = Number(element.x2) || 0;
                    const y2 = Number(element.y2) || 0;
                    const strokeColor = element.stroke || '#000000';
                    const strokeWidth = Number(element.strokeWidth) || 1;

                    doc.save();
                    doc.moveTo(x1, y1).lineTo(x2, y2).lineWidth(strokeWidth).stroke(strokeColor);
                    doc.restore();
                }
            }

            doc.end();
        });
    }

    /**
     * Renders the Advanced SST Certificate by:
     *   1. Building a full-fidelity SVG (mirrors the React Certificate.tsx layout)
     *   2. Rasterising the SVG to PNG with sharp
     *   3. Wrapping the PNG as a single-page PDFKit document
     *
     * This gives a pixel-perfect result that matches the React component exactly.
     */
    private async renderAdvancedCertificatePdf(issuedCertificate: any): Promise<Buffer> {
        const dataMap: Record<string, any> = {
            ...this.buildDefaultCertificateData(issuedCertificate.studentId),
            ...(issuedCertificate.data || {}),
            certificate_number: issuedCertificate.certificateNumber,
            certificate_no: issuedCertificate.certificateNumber,
            issue_date: this.formatDate(issuedCertificate.issuedAt || issuedCertificate.createdAt),
        };

        // Build the CertificateData object from the merged data map
        const certData: CertificateData = {
            certificateNo: dataMap.certificate_no || dataMap.certificate_number || '',
            enrollmentNo: dataMap.enrollment_no || dataMap.roll_no || '',
            studentName: dataMap.student_name || dataMap.student_full_name || '',
            fatherName: dataMap.father_name || '',
            motherName: dataMap.mother_name || '',
            dob: dataMap.dob || dataMap.date_of_birth || '',
            courseName: dataMap.course_name || dataMap.course || '',
            securedPercent: dataMap.secured_percent || '',
            grade: dataMap.grade || '',
            session: dataMap.session || '',
            centerCode: dataMap.center_code || '',
            centerName: dataMap.center_name || 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
            centerAddress: dataMap.center_address || dataMap.institute_address || '',
            issueDate: dataMap.issue_date || '',
            studentPhotoUrl: dataMap.student_photo || '',
            qrCodeUrl: dataMap.qr_code || this.buildCertificateQrCode(dataMap),
        };

        // Rasterise SVG → PNG via sharp
        const pngBuffer = await renderCertificateAsPng(certData);

        // Standard A4 Portrait Dimensions (595.28 x 841.89 points)
        const pdfWidth = 595.28;
        const pdfHeight = 841.89;

        const doc = new PDFDocument({ size: [pdfWidth, pdfHeight], margin: 0 });
        const chunks: Buffer[] = [];

        return new Promise<Buffer>((resolve, reject) => {
            doc.on('data', (c) => chunks.push(c));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            // Draw the certificate image scaled to fill the entire A4 page
            doc.image(pngBuffer, 0, 0, { width: pdfWidth, height: pdfHeight });
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

        const centerName = 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE';
        const centerAddress = '12, Radhe, Dhikunni Bharawan, Hardoi Uttar Pradesh 241203';

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
            enrollment_no: rollNo,
            certificate_number: '',
            certificate_no: '',
            session,
            date: issueDate,
            issue_date: issueDate,
            student_photo: student?.studentPhoto || '',
            institute_name: centerName,
            institute_address: centerAddress,
            institute_contact: '9519222486, 7376486686',
            center_name: centerName,
            center_address: centerAddress,
            center_code: student?.centerCode || '',
            secured_percent: student?.securedPercent || '',
            grade: student?.grade || '',
        };

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const verificationUrl = `${frontendUrl.replace(/\/$/, '')}/verify-certificate?enrollment=${encodeURIComponent(rollNo)}`;

        return {
            ...baseData,
            qr_code: `https://quickchart.io/qr?size=170&margin=1&text=${encodeURIComponent(verificationUrl)}`,
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
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const certNo = data?.certificate_no || data?.certificate_number || '';
        const verificationUrl = `${frontendUrl.replace(/\/$/, '')}/verify-certificate?certNo=${encodeURIComponent(certNo)}`;

        return `https://quickchart.io/qr?size=170&margin=1&text=${encodeURIComponent(verificationUrl)}`;
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

    private calculateGrade(percentage: number): string {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        if (percentage >= 40) return 'D';
        return 'Fail';
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
        const templates = [
            DEFAULT_SST_CERTIFICATE_TEMPLATE,
            DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE,
            ADVANCED_SST_CERTIFICATE_TEMPLATE,
            ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE,
        ];
        let defaultTemplate: any = null;

        for (const template of templates) {
            // Always upsert system templates so design changes in code are reflected immediately
            const upserted = await this.certificateTemplateModel.findOneAndUpdate(
                { name: template.name },
                {
                    $set: {
                        design: template.design,
                        dimensions: template.dimensions,
                        backgroundImage: (template as any).backgroundImage ?? '',
                    },
                    $setOnInsert: { name: template.name, isActive: true },
                },
                { upsert: true, new: true },
            );

            if (template.name === DEFAULT_SST_CERTIFICATE_TEMPLATE_NAME) {
                defaultTemplate = upserted;
            }
        }

        return defaultTemplate;
    }
}

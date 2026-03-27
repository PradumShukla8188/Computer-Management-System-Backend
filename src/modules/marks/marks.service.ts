import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import * as path from 'path';
import mongoose, { Model } from 'mongoose';
import { Student } from 'src/models';
import { StudentMark, StudentMarkDocument } from '../../models/marks/student-mark.schema';
import { CreateStudentMarkDto, SearchPublicMarksheetDto, UpdateStudentMarkDto } from './marks.dto';

@Injectable()
export class MarksService {
    constructor(
        @InjectModel(StudentMark.name)
        private markModel: Model<StudentMarkDocument>,
        @InjectModel(Student.name)
        private studentModel: Model<any>,
    ) { }

    // Calculate grade
    private calculateGrade(percentage: number): string {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        return 'Fail';
    }

    // async addMarks(dto: CreateStudentMarkDto) {
    //     const percentage = (dto.obtainedMarks / dto.totalMarks) * 100;

    //     const studentMongoId = new mongoose.Types.ObjectId(dto.studentId);
    //     const courseMongoId = new mongoose.Types.ObjectId(dto.courseId);
    //     const subjectMongoId = new mongoose.Types.ObjectId(dto.subjectId);

    //     const mark = await this.markModel.create({
    //         studentId: studentMongoId,
    //         courseId: courseMongoId,
    //         subjectId: subjectMongoId,
    //         examName: dto.examName,
    //         totalMarks: dto.totalMarks,
    //         obtainedMarks: dto.obtainedMarks,
    //         grade: this.calculateGrade(percentage),
    //     });

    //     return mark;
    // }
    async addMarks(dto: CreateStudentMarkDto) {
        const studentMongoId = new mongoose.Types.ObjectId(dto.studentId);
        const courseMongoId = new mongoose.Types.ObjectId(dto.courseId);

        const marksPayload = dto.subjects.map(subject => {
            const percentage = (subject.obtainedMarks / subject.totalMarks) * 100;

            return {
                studentId: studentMongoId,
                courseId: courseMongoId,
                subjectId: new mongoose.Types.ObjectId(subject.subjectId),
                examName: dto.examName,
                totalMarks: subject.totalMarks,
                obtainedMarks: subject.obtainedMarks,
                grade: this.calculateGrade(percentage),
                isPublished: dto.isPublished ?? true,
            };
        });

        const savedMarks = await this.markModel.insertMany(marksPayload);

        return {
            message: 'Marks added successfully',
            data: savedMarks,
        };
    }


    async updateMarks(id: string, dto: UpdateStudentMarkDto) {
        const markDoc = await this.markModel.findById(id);

        if (!markDoc) {
            throw new NotFoundException('Marks not found');
        }

        // Update exam-level fields
        // if (dto.examName) markDoc.examName = dto.examName;

        // Update subjects
        // if (dto.subjects?.length) {
        // dto.subjects.forEach(updatedSub => {
        //     const existingSub = markDoc.subjects.find(
        //         s => s.subjectId.toString() === updatedSub.subjectId,
        //     );

        //     if (!existingSub) {
        //         throw new BadRequestException('Subject not found in marks');
        //     }

        //     if (updatedSub.obtainedMarks > updatedSub.totalMarks) {
        //         throw new BadRequestException(
        //             'Obtained marks cannot exceed total marks',
        //         );
        //     }

        //     existingSub.totalMarks = updatedSub.totalMarks;
        //     existingSub.obtainedMarks = updatedSub.obtainedMarks;

        //     const percentage =
        //         (updatedSub.obtainedMarks / updatedSub.totalMarks) * 100;

        //     existingSub.grade = this.calculateGrade(percentage);
        // });
        // }

        return markDoc.save();
    }


    async getMarksByStudent(studentId: string) {
        return this.markModel
            .find({ studentId })
            .populate('courseId')
            .populate('subjectId');
    }


    async getMarksByExam(examName: string) {
        return this.markModel
            .find({ examName })
            .populate('studentId')
            .populate('courseId')
            .populate('subjectId');
    }

    async getAllMarks() {
        const marks = await this.markModel
            .find()
            .populate({
                path: 'studentId',
                select: 'name rollNo',
            })
            .populate({
                path: 'courseId',
                select: 'name shortName',
            })
            .populate({
                path: 'subjectId',
                select: 'title',
            })
            .sort({ createdAt: -1 })
            .lean();

        return {
            message: 'Marks fetched successfully',
            data: marks,
        };
    }

    async deleteMarks(id: string) {
        return this.markModel.findByIdAndDelete(id);
    }

    async updatedMarks(id: string, dto: UpdateStudentMarkDto) {
        const updatePayload: Record<string, any> = { ...dto };

        if (dto.totalMarks !== undefined || dto.obtainedMarks !== undefined) {
            const currentMark = await this.markModel.findById(id).lean();
            if (!currentMark) {
                throw new NotFoundException('Marks not found');
            }

            const totalMarks = dto.totalMarks ?? currentMark.totalMarks;
            const obtainedMarks = dto.obtainedMarks ?? currentMark.obtainedMarks;
            const percentage = totalMarks > 0 ? (obtainedMarks / totalMarks) * 100 : 0;
            updatePayload.grade = this.calculateGrade(percentage);
        }

        return this.markModel.findByIdAndUpdate(id, updatePayload, { new: true });
    }

    async searchPublicMarksheet(query: SearchPublicMarksheetDto) {
        const searchType = query.searchType || 'roll';
        const cleaned = query.search.trim();

        const studentFilter: any = { deletedAt: null };
        if (searchType === 'roll') {
            studentFilter.rollNo = { $regex: `^${this.escapeRegex(cleaned)}$`, $options: 'i' };
        } else {
            studentFilter.name = { $regex: this.escapeRegex(cleaned), $options: 'i' };
        }

        const students = await this.studentModel
            .find(studentFilter)
            .populate('courseId')
            .sort({ createdAt: -1 })
            .limit(searchType === 'roll' ? 1 : 20)
            .lean();

        if (!students.length) {
            return {
                success: true,
                data: [],
                message: 'No student found',
            };
        }

        const data = await Promise.all(
            students.map(async (student: any) => {
                const marks = await this.markModel
                    .find({ studentId: student._id, isPublished: true })
                    .populate('subjectId', 'title')
                    .populate('courseId', 'name shortName')
                    .sort({ createdAt: 1 })
                    .lean();

                if (!marks.length) {
                    return {
                        student,
                        marksheet: null,
                    };
                }

                const marksheet = this.buildMarksheetPayload(student, marks);
                return {
                    student,
                    marksheet,
                };
            }),
        );

        return {
            success: true,
            data,
        };
    }

    async buildPublicMarksheetPdf(studentId: string, examName?: string) {
        const student = await this.studentModel.findById(studentId).populate('courseId').lean();
        if (!student) {
            throw new NotFoundException('Student not found');
        }

        const marksFilter: any = {
            studentId: new mongoose.Types.ObjectId(studentId),
            isPublished: true,
        };
        if (examName) {
            marksFilter.examName = examName;
        }

        const marks = await this.markModel
            .find(marksFilter)
            .populate('subjectId', 'title')
            .populate('courseId', 'name shortName')
            .sort({ createdAt: 1 })
            .lean();

        if (!marks.length) {
            throw new NotFoundException('Published marksheet not found');
        }

        const payload = this.buildMarksheetPayload(student, marks);
        const buffer = await this.renderMarksheetPdf(payload);

        return {
            fileName: `${(payload.rollNumber || 'marksheet').replace(/\s+/g, '-')}.pdf`,
            buffer,
        };
    }

    private buildMarksheetPayload(student: any, marks: any[]) {
        const totalObtained = marks.reduce((sum, mark) => sum + (Number(mark.obtainedMarks) || 0), 0);
        const totalMax = marks.reduce((sum, mark) => sum + (Number(mark.totalMarks) || 0), 0);
        const percentageValue = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
        const percentage = percentageValue.toFixed(2);
        const examName = marks[0]?.examName || 'Marksheet';
        const issuedAt = marks[marks.length - 1]?.createdAt || new Date();

        return {
            examName,
            studentId: student._id?.toString?.() || '',
            rollNumber: student?.rollNo || '-',
            name: student?.name || '-',
            fatherName: student?.fatherName || '-',
            dateOfBirth: this.formatDate(student?.dob),
            course: student?.courseId?.name || '-',
            duration: student?.courseDuration || '-',
            issueDate: this.formatDate(issuedAt),
            registrationNumber: student?.rollNo || '-',
            percentage,
            grade: this.calculateGrade(percentageValue),
            result: percentageValue >= 40 ? 'PASSED' : 'FAILED',
            totalObtained,
            totalMax,
            studentPhoto: student?.studentPhoto || '',
            subjects: marks.map((mark) => ({
                name: mark?.subjectId?.title || 'Subject',
                theory: Number(mark?.obtainedMarks) || 0,
                practical: 0,
                total: Number(mark?.obtainedMarks) || 0,
                maxMarks: Number(mark?.totalMarks) || 0,
                grade: mark?.grade || this.calculateGrade(((Number(mark?.obtainedMarks) || 0) / Math.max(Number(mark?.totalMarks) || 1, 1)) * 100),
            })),
        };
    }

    private async renderMarksheetPdf(payload: any): Promise<Buffer> {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 0,
            info: {
                Title: `${payload.rollNumber} Marksheet`,
                Author: 'Computer Management System',
            },
        });

        const chunks: Buffer[] = [];

        return new Promise<Buffer>((resolve, reject) => {
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const pageWidth = doc.page.width;
            const pageHeight = doc.page.height;
            const logo = this.loadAssetBuffer('/images/logo/SST-logo.png');
            const studentPhoto = this.loadAssetBuffer(payload.studentPhoto);

            doc.rect(0, 0, pageWidth, pageHeight).fill('#fffef8');
            doc.rect(0, 0, pageWidth, pageHeight).lineWidth(18).stroke('#f0c817');
            doc.rect(22, 22, pageWidth - 44, pageHeight - 44).lineWidth(4).stroke('#21418c');

            if (logo) {
                doc.image(logo, 42, 42, { width: 58, height: 58 });
            }

            doc.fillColor('#163472').font('Helvetica-Bold').fontSize(22).text('SST COMPUTER & WELL KNOWLEDGE INSTITUTE', 112, 44);
            doc.fillColor('#4b5563').font('Helvetica').fontSize(10)
                .text('Dikunni Dhikunni, Uttar Pradesh 241203', 112, 72)
                .text('Contact: 9519222486, 7376486686 | Email: SSTCOMPUTER115@GMAIL.COM', 112, 88);

            if (studentPhoto) {
                doc.rect(pageWidth - 102, 42, 58, 72).strokeColor('#94a3b8').stroke();
                doc.image(studentPhoto, pageWidth - 100, 44, { width: 54, height: 68 });
            }

            doc.roundedRect(40, 128, pageWidth - 80, 40, 12).fill('#21418c');
            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(20).text('MARKSHEET', 0, 141, { align: 'center' });
            doc.font('Helvetica').fontSize(10).text('Official Academic Performance Record', 0, 160, { align: 'center' });

            const detailRows = [
                ['Student Name', payload.name],
                ["Father's Name", payload.fatherName],
                ['Roll Number', payload.rollNumber],
                ['Registration No.', payload.registrationNumber],
                ['Date of Birth', payload.dateOfBirth],
                ['Issue Date', payload.issueDate],
                ['Course', payload.course],
                ['Duration', payload.duration],
            ];

            let y = 190;
            detailRows.forEach(([label, value], index) => {
                const x = index % 2 === 0 ? 48 : 305;
                if (index % 2 === 0 && index > 0) y += 24;
                doc.fillColor('#111827').font('Helvetica-Bold').fontSize(11).text(`${label}:`, x, y, { continued: true });
                doc.font('Helvetica').text(` ${value || '-'}`);
            });

            const tableTop = 300;
            const columns = [48, 90, 320, 412, 500];
            doc.rect(42, tableTop, 512, 26).fill('#21418c');
            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
            ['#', 'Subject', 'Obtained', 'Maximum', 'Grade'].forEach((heading, index) => {
                doc.text(heading, columns[index], tableTop + 8, { width: index === 1 ? 200 : 70 });
            });

            let rowY = tableTop + 26;
            doc.fillColor('#111827').font('Helvetica').fontSize(10);
            payload.subjects.forEach((subject: any, index: number) => {
                doc.rect(42, rowY, 512, 24).strokeColor('#d1d5db').stroke();
                doc.text(String(index + 1), columns[0], rowY + 7, { width: 28 });
                doc.text(subject.name || '-', columns[1], rowY + 7, { width: 210 });
                doc.text(String(subject.total ?? '-'), columns[2], rowY + 7, { width: 60, align: 'center' });
                doc.text(String(subject.maxMarks ?? '-'), columns[3], rowY + 7, { width: 60, align: 'center' });
                doc.fillColor('#163472').font('Helvetica-Bold').text(subject.grade || '-', columns[4], rowY + 7, { width: 50, align: 'center' });
                doc.fillColor('#111827').font('Helvetica');
                rowY += 24;
            });

            rowY += 22;
            const summaryWidth = 156;
            doc.roundedRect(42, rowY, summaryWidth, 66, 10).fill('#fff8d5').stroke('#f0c817');
            doc.fillColor('#8a6500').font('Helvetica-Bold').fontSize(10).text('TOTAL OBTAINED', 54, rowY + 12);
            doc.fillColor('#111827').fontSize(24).text(String(payload.totalObtained), 54, rowY + 28);
            doc.fillColor('#4b5563').font('Helvetica').fontSize(10).text(`Out of ${payload.totalMax}`, 54, rowY + 54);

            doc.roundedRect(218, rowY, summaryWidth, 66, 10).fill('#edf3ff').stroke('#21418c');
            doc.fillColor('#21418c').font('Helvetica-Bold').fontSize(10).text('PERCENTAGE', 230, rowY + 12);
            doc.fillColor('#111827').fontSize(24).text(`${payload.percentage}%`, 230, rowY + 28);
            doc.fillColor('#4b5563').font('Helvetica').fontSize(10).text('Overall percentage', 230, rowY + 54);

            doc.roundedRect(394, rowY, 160, 66, 10).fill('#ffffff').stroke('#d1d5db');
            doc.fillColor('#6b7280').font('Helvetica-Bold').fontSize(10).text('RESULT', 406, rowY + 12);
            doc.roundedRect(406, rowY + 28, 94, 22, 11).fill(payload.result === 'PASSED' ? '#059669' : '#dc2626');
            doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12).text(payload.result, 406, rowY + 34, { width: 94, align: 'center' });

            doc.end();
        });
    }

    private formatDate(value?: Date | string) {
        if (!value) {
            return '-';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    private escapeRegex(value: string) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    private loadAssetBuffer(assetPath?: string): Buffer | null {
        if (!assetPath) {
            return null;
        }

        if (assetPath.startsWith('data:image')) {
            const base64 = assetPath.split(',')[1];
            return base64 ? Buffer.from(base64, 'base64') : null;
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

}

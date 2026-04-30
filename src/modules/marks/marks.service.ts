import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
// @ts-ignore
import PDFDocument = require('pdfkit');
import * as path from 'path';
import mongoose, { Model } from 'mongoose';
import { Student } from 'src/models';
import { StudentMark, StudentMarkDocument } from '../../models/marks/student-mark.schema';
import { CreateStudentMarkDto, SearchPublicMarksheetDto, UpdateStudentMarkDto } from './marks.dto';
import { renderMarksheetAsPng, SVG_MARKSHEET_HEIGHT, SVG_MARKSHEET_WIDTH } from './marksheet-svg-renderer';

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
            motherName: student?.motherName || '-',
            dateOfBirth: this.formatDate(student?.dob),
            course: student?.courseId?.name || '-',
            duration: student?.courseDuration || '-',
            session: student?.session || '-',
            issueDate: this.formatDate(issuedAt),
            registrationNumber: student?.rollNo || '-',
            percentage,
            grade: this.calculateGrade(percentageValue),
            result: percentageValue >= 40 ? 'PASSED' : 'FAILED',
            totalObtained,
            totalMax,
            studentPhoto: student?.studentPhoto || '',
            qr_code: `https://sstci.in/verify?roll=${student?.rollNo || ''}`,
            subjects: marks.map((mark) => ({
                name: mark?.subjectId?.title || 'Subject',
                theory: Number(mark?.obtainedMarks) || 0,
                practical: 0,
                maxMarks: Number(mark?.totalMarks) || 100,
                grade: mark?.grade || this.calculateGrade(((Number(mark?.obtainedMarks) || 0) / Math.max(Number(mark?.totalMarks) || 1, 1)) * 100),
            })),
        };
    }

    async renderMarksheetPdf(payload: any) {
        const pngBuffer = await renderMarksheetAsPng({
            marksheetNo: payload.marksheetNo || payload.rollNumber,
            rollNo: payload.rollNumber,
            studentName: payload.name,
            fatherName: payload.fatherName,
            motherName: payload.motherName,
            dob: payload.dateOfBirth,
            courseName: payload.course,
            session: payload.session || '-',
            centerName: payload.centerName || 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE',
            centerAddress: payload.centerAddress || 'Dhikunni Chauraha, Sai Nath Road, Bharawan, Sandila, Hardoi, U.P. 241203',
            issueDate: payload.issueDate,
            studentPhotoUrl: payload.studentPhoto,
            qrCodeUrl: payload.qr_code || '',
            subjects: payload.subjects.map(s => ({
                title: s.name,
                totalMarks: s.maxMarks,
                obtainedMarks: s.theory
            })),
            totalObtained: payload.totalObtained,
            totalMaximum: payload.totalMax,
            percentage: payload.percentage,
            grade: payload.grade,
            result: payload.result
        });

        const doc = new PDFDocument({
            size: [SVG_MARKSHEET_WIDTH, SVG_MARKSHEET_HEIGHT],
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

            doc.image(pngBuffer, 0, 0, { width: SVG_MARKSHEET_WIDTH, height: SVG_MARKSHEET_HEIGHT });
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

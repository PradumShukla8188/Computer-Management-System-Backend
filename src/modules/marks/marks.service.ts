import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { StudentMark, StudentMarkDocument } from '../../models/marks/student-mark.schema';
import { CreateStudentMarkDto, UpdateStudentMarkDto } from './marks.dto';

@Injectable()
export class MarksService {
    constructor(
        @InjectModel(StudentMark.name)
        private markModel: Model<StudentMarkDocument>,
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
        return this.markModel.findByIdAndUpdate(id, dto);
    }


}

// exam.service.ts (simplified)
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import * as PDFDocument from 'pdfkit';
import { CreateExamDto, GetExamListDto } from './exam.dto';
import { ExamMode, ExamType } from 'src/constants/enum';




@Injectable()
export class ExamService {
    constructor(
        @InjectModel('Exam') private examModel: Model<any>,
        @InjectModel('Question') private questionModel: Model<any>,
        @InjectModel('Option') private optionModel: Model<any>,
        @InjectModel('Attempt') private attemptModel: Model<any>,
        @InjectModel('CertificateTemplate') private certTemplateModel: Model<any>,
    ) { }

    // async createExam(dto: CreateExamDto) {
    //     // const exam = await this.examModel.create(dto);
    //     // return { message: 'EXAM_CREATED', data: exam };
    //     const session = await mongoose.startSession();
    //     session.startTransaction();

    //     try {
    //         //  Create Exam
    //         const exam = await this.examModel.create(
    //             [
    //                 {
    //                     ...dto,
    //                     examDate: new Date(dto.examDate),
    //                     courseId: new mongoose.Types.ObjectId(dto.courseId),
    //                 },
    //             ],
    //             { session },
    //         );

    //         const examId = exam[0]._id;

    //         //  Create Questions & Options
    //         for (const q of dto.questions) {
    //             const question = await this.questionModel.create(
    //                 [
    //                     {
    //                         examId,
    //                         text: q.text,
    //                         marks: q.marks,
    //                         // meta: q.meta,
    //                     },
    //                 ],
    //                 { session },
    //             );

    //             const questionId = question[0]._id;

    //             // if (dto.mode == ExamType.OBJECTIVE) {
    //             const optionsPayload = q.options.map(opt => ({
    //                 questionId,
    //                 text: opt.text,
    //                 isCorrect: opt.isCorrect,
    //             }));

    //             await this.optionModel.insertMany(optionsPayload, { session });
    //             // }
    //         }

    //         await session.commitTransaction();
    //         session.endSession();

    //         return {
    //             message: 'Exam created successfully',
    //             examId,
    //         };
    //     } catch (error) {
    //         await session.abortTransaction();
    //         session.endSession();
    //         throw error;
    //     }
    // }
    async createExam(dto: CreateExamDto) {
        const exam = await this.examModel.create({
            ...dto,
            examDate: new Date(dto.examDate),
            courseId: new mongoose.Types.ObjectId(dto.courseId),
        });

        for (const q of dto.questions) {
            const question = await this.questionModel.create({
                examId: exam._id,
                text: q.text,
                marks: q.marks,
            });

            const optionsPayload = q.options.map(opt => ({
                questionId: question._id,
                text: opt.text,
                isCorrect: opt.isCorrect,
            }));

            await this.optionModel.insertMany(optionsPayload);
        }

        return {
            message: 'Exam created successfully',
            examId: exam._id,
        };
    }


    async getExamWithDetails(id: string) {

        const examId = new mongoose.Types.ObjectId(id);

        const exam = await this.examModel.findById(examId).lean();

        if (!exam) {
            throw new NotFoundException('Exam not found');
        }

        const questions = await this.questionModel
            .find({ examId })
        // .lean();

        const questionIds = questions.map(q => q._id);

        const options = await this.optionModel
            .find({ questionId: { $in: questionIds } })
        // .lean();

        const questionsWithOptions = questions.map(q => ({
            ...q,
            options: options.filter(o => o.questionId.toString() === q._id.toString()),
        }));

        return {
            exam: {
                ...exam,
                questions: questionsWithOptions,
            },
        };
    }



    // async getAllExamsSummary() {
    //     const examSummary = await this.examModel.aggregate([
    //         {
    //             $lookup: {
    //                 from: 'courses',
    //                 localField: 'courseId',
    //                 foreignField: '_id',
    //                 as: 'course',
    //             },
    //         },
    //         { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },

    //         {
    //             $lookup: {
    //                 from: 'questions',
    //                 localField: '_id',
    //                 foreignField: 'examId',
    //                 as: 'questions',
    //             },
    //         },
    //         {
    //             $addFields: {
    //                 questionCount: { $size: '$questions' },
    //             },
    //         },

    //         {
    //             $lookup: {
    //                 from: 'studentcourses',
    //                 localField: 'courseId',
    //                 foreignField: 'courseId',
    //                 as: 'students',
    //             },
    //         },
    //         {
    //             $addFields: {
    //                 studentCount: { $size: '$students' },
    //             },
    //         },

    //         {
    //             $project: {
    //                 _id: 1,
    //                 title: 1,
    //                 description: 1,
    //                 createdAt: 1,
    //                 updatedAt: 1,
    //                 questionCount: 1,
    //                 courseName: '$course.name',
    //                 studentCount: 1,
    //             },
    //         },
    //     ]);

    //     return examSummary;
    // }



    async getAllExamsSummary(query: GetExamListDto) {
        const { page = 1, limit = 10, courseId, title } = query;

        // Build match filter
        const matchFilter: any = {};
        if (courseId) {
            matchFilter.courseId = new mongoose.Types.ObjectId(courseId);
        }
        if (title) {
            matchFilter.title = { $regex: title, $options: 'i' };
        }

        const examSummary = await this.examModel.aggregate([
            { $match: matchFilter },

            {
                $lookup: {
                    from: 'courses',
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course',
                },
            },
            { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'questions',
                    localField: '_id',
                    foreignField: 'examId',
                    as: 'questions',
                },
            },
            { $addFields: { questionCount: { $size: '$questions' } } },

            {
                $lookup: {
                    from: 'students',
                    localField: 'courseId',
                    foreignField: 'courseId',
                    as: 'students',
                },
            },
            { $addFields: { studentCount: { $size: '$students' } } },

            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    questionCount: 1,
                    courseName: '$course.name',
                    studentCount: 1,
                },
            },

            { $skip: (page - 1) * limit },
            { $limit: limit },
        ]);

        const totalExams = await this.examModel.countDocuments(matchFilter);

        return {
            data: {
                exams: examSummary, page,
                limit,
                total: totalExams,
                totalPages: Math.ceil(totalExams / limit),
            },

        };
    }


}

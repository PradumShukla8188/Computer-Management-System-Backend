import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;
export enum QuestionType { MCQ = 'MCQ', TYPING = 'TYPING' }

@Schema({ timestamps: true })
export class Question {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true })
    examId: mongoose.Types.ObjectId;

    @Prop({ required: true, enum: QuestionType })
    questionType: QuestionType;

    @Prop({ required: true })
    text: string;

    @Prop({ default: 1 })
    marks: number;

    @Prop({ required: true })
    meta?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

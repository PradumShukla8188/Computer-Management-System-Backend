import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { QuestionType } from 'src/constants/enum';

export type QuestionDocument = HydratedDocument<Question>;


@Schema({ timestamps: true })
export class Question {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true })
    examId: mongoose.Types.ObjectId;

    @Prop({ type: String, enum: QuestionType, default: QuestionType.MCQ })
    questionType: QuestionType;

    @Prop({ required: true })
    text: string;

    @Prop({ default: 1 })
    marks: number;

    @Prop({ required: true })
    meta?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

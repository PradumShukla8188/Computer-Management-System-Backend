import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ExamMode, ExamType } from 'src/constants/enum';

export type ExamDocument = HydratedDocument<Exam>;

@Schema({ timestamps: true })
export class Exam {
    @Prop({ required: true })
    title: string;

    @Prop()
    description?: string;

    @Prop({ required: true, enum: ExamType })
    type: ExamType;

    @Prop({ required: true, enum: ExamMode })
    mode: ExamMode;

    @Prop({ required: true })
    durationMinutes: number;

    @Prop({ required: true })
    totalMarks: number;

    @Prop({ required: true })
    passMarks: number;

    @Prop({ type: Object, default: {} })
    meta?: Record<string, any>;

    @Prop({ default: false })
    negativeMarking: boolean;

    @Prop({ default: 0 })
    negativeMarksPerQuestion: number;

    @Prop({ default: true })
    autoResultDeclare: boolean;

    @Prop({ default: false })
    isPublished: boolean;

    @Prop({ required: true })
    examDate: Date;

    @Prop({ required: true })
    startTime: string; // "10:00"

    @Prop({ required: true })
    endTime: string; // "12:00"

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
    courseId: mongoose.Types.ObjectId;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);

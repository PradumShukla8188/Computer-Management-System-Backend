import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type StudentMarkDocument = HydratedDocument<StudentMark>;

@Schema({ timestamps: true })
export class StudentMark {

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true })
    studentId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
    courseId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true })
    subjectId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    examName: string; // Monthly Test, Final Exam, Practical

    @Prop({ required: true })
    totalMarks: number;

    @Prop({ required: true })
    obtainedMarks: number;

    @Prop()
    grade: string;

    @Prop({ default: true })
    isPublished: boolean;
}

export const StudentMarkSchema = SchemaFactory.createForClass(StudentMark);

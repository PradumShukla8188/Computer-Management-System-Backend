import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import { Course } from '../course/course.schema';
import { Student } from './student.schema';
export type StudentFeesDocument = HydratedDocument<StudentFees>;

@Schema({ timestamps: true })
export class StudentFees {

    @Prop({ required: true })
    amount: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
    courseId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true })
    studentId: mongoose.Types.ObjectId;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

    @Prop()
    deletedAt?: Date;

}

export const StudentFeesSchema = SchemaFactory.createForClass(StudentFees);
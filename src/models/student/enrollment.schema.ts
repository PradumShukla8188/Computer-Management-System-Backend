import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Student } from '../student/student.schema';
import { Course } from '../course/course.schema';
import { Institute } from '../institute/institute.schema';
import { PaymentTransaction } from '../payments/paymentTransaction.schema';

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({ timestamps: true })
export class Enrollment {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true })
    studentId: Student;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
    courseId: Course;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true })
    instituteId: Institute;

    @Prop({ default: Date.now })
    enrollmentDate: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction', required: true })
    paymentId: PaymentTransaction;

    @Prop({ default: true })
    isActive: boolean;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Gender, Religion, Category, ExamMode, UserStatus } from 'src/constants/enum';
import { Role } from '../role/role.schema';

export type StudentDocument = HydratedDocument<Student>;

@Schema({ timestamps: true })
export class Student {

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    fatherName: string;

    @Prop({ required: true, trim: true })
    motherName: string;

    @Prop({ required: true })
    dob: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    roleId: Role;

    @Prop({ required: true, enum: Gender })
    gender: Gender;

    @Prop({ required: true, trim: true })
    mobile: string;

    @Prop({ required: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true, trim: true })
    residentialAddress: string;

    @Prop({ required: true, trim: true })
    state: string;

    @Prop({ required: true, trim: true })
    district: string;

    @Prop({ required: true, trim: true })
    country: string;

    @Prop({ required: true, trim: true })
    pinCode: string;

    @Prop({ required: true, enum: Religion })
    religion: Religion;

    @Prop({ required: true, enum: Category })
    category: Category;

    @Prop({ required: true })
    dateOfAdmission: Date;

    @Prop({ required: true, trim: true })
    selectedCourse: string;

    @Prop({ required: true, trim: true })
    courseDuration: string; // e.g. "1 Year", "6 Months"

    @Prop({ required: true, trim: true })
    session: string; // e.g. "2024-2025"

    @Prop({ required: true })
    totalFees: number;

    @Prop({ required: true, enum: ExamMode })
    examMode: ExamMode;

    // File uploads (photo, documents)
    @Prop()
    studentPhoto: string;

    @Prop()
    uploadEducationProof: string;

    @Prop()
    uploadIdentityProof: string;

    @Prop({ required: true, enum: UserStatus, default: UserStatus.Active })
    status: UserStatus;

    @Prop({ unique: true, required: true, trim: true })
    rollNo: string;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

    @Prop()
    deletedAt?: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserStatus } from 'src/constants/enum';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    shortName: string;

    @Prop({ required: true, trim: true })
    description: string

    @Prop({ required: true, enum: UserStatus, default: UserStatus.Active })
    status: UserStatus;

    @Prop({ required: true, default: 0 })
    durationInMonths: number

    @Prop({ required: true, default: 0 })
    monthlyFees: number

    @Prop({ required: true, default: 0 })
    totalFees: number

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }] })
    subjectsIds: mongoose.Types.ObjectId[];

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

    @Prop()
    deletedAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
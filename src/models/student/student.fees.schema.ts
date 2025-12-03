import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type StudentFeesDocument = HydratedDocument<StudentFees>;

@Schema({ timestamps: true })
export class StudentFees {

    @Prop({ required: true })
    amount: number;

    // @Prop({ required: true, ref: 'Courses' })
    // courseId: Courses

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;

    @Prop()
    deletedAt?: Date;

}

export const StudentFeesSchema = SchemaFactory.createForClass(StudentFees);
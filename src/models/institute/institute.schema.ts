import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';

export type InstituteDocument = HydratedDocument<Institute>;

@Schema({ timestamps: true })
export class Institute {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    ownerId: User;

    @Prop({ required: false, trim: true })
    subdomain?: string;

    @Prop({ required: true, default: 0 })
    commissionPercentage: number; // Percentage cut for the platform

    @Prop({ default: true })
    isActive: boolean;
}

export const InstituteSchema = SchemaFactory.createForClass(Institute);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type IssuedCertificateDocument = HydratedDocument<IssuedCertificate>;

@Schema({ timestamps: true })
export class IssuedCertificate {
    @Prop({ required: true, unique: true, trim: true, index: true })
    certificateNumber: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true })
    studentId: mongoose.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate', required: true })
    templateId: mongoose.Types.ObjectId;

    @Prop({ type: Object, default: {} })
    data: Record<string, any>;

    @Prop({ type: Date, default: Date.now })
    issuedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    issuedBy?: mongoose.Types.ObjectId;
}

export const IssuedCertificateSchema = SchemaFactory.createForClass(IssuedCertificate);

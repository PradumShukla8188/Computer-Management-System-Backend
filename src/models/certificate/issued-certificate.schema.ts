import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type IssuedCertificateDocument = HydratedDocument<IssuedCertificate>;

@Schema({ timestamps: true })
export class IssuedCertificate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true })
  studentId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate', required: true })
  templateId: mongoose.Types.ObjectId;

  @Prop({ type: Object, required: true })
  data: Record<string, string>; // Mapped values for placeholders

  @Prop({ required: true, unique: true })
  certificateNumber: string;

  @Prop({ default: Date.now })
  issueDate: Date;

  @Prop()
  pdfUrl?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const IssuedCertificateSchema = SchemaFactory.createForClass(IssuedCertificate);

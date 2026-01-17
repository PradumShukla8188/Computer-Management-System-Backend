import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CertificateTemplateDocument = HydratedDocument<CertificateTemplate>;

@Schema({ timestamps: true })
export class CertificateTemplate {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Object, required: true })
  design: any; // Konva JSON structure

  @Prop({
    type: {
      width: { type: Number, default: 1123 }, // A4 Landscape roughly
      height: { type: Number, default: 794 },
    },
    required: true,
  })
  dimensions: { width: number; height: number };

  @Prop({ trim: true })
  backgroundImage?: string;

  @Prop({ type: [String], default: [] })
  placeholders: string[];

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const CertificateTemplateSchema = SchemaFactory.createForClass(CertificateTemplate);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Institute } from '../institute/institute.schema';

export type CertificateTemplateDocument = HydratedDocument<CertificateTemplate>;

class Position {
  @Prop({ required: true }) x: number;
  @Prop({ required: true }) y: number;
  @Prop({ required: true }) fontSize: number;
}

@Schema({ timestamps: true })
export class CertificateTemplate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true })
  instituteId: Institute;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  imagePath: string;

  @Prop({ type: Position, required: true })
  namePos: Position;

  @Prop({ type: Position, required: true })
  rollPos: Position;

  @Prop({ type: Position, required: true })
  datePos: Position;

  @Prop({ type: Object })
  other?: any;
}

export const CertificateTemplateSchema = SchemaFactory.createForClass(CertificateTemplate);

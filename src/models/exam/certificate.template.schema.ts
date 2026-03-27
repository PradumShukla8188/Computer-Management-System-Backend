import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CertificateTemplateDocument = HydratedDocument<CertificateTemplate>;

class Position {
    @Prop() x?: number;
    @Prop() y?: number;
    @Prop() fontSize?: number;
}

class TemplateDimensions {
    @Prop({ required: true, default: 1123 })
    width: number;

    @Prop({ required: true, default: 794 })
    height: number;
}

@Schema({ timestamps: true })
export class CertificateTemplate {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ type: [Object], default: [] })
    design: any[];

    @Prop({ type: TemplateDimensions, required: true, default: { width: 1123, height: 794 } })
    dimensions: TemplateDimensions;

    @Prop({ trim: true })
    backgroundImage?: string;

    @Prop({ default: true })
    isActive?: boolean;

    // Legacy optional fields kept for backward compatibility.
    @Prop()
    imagePath?: string;

    @Prop({ type: Position })
    namePos?: Position;

    @Prop({ type: Position })
    rollPos?: Position;

    @Prop({ type: Position })
    datePos?: Position;

    @Prop({ type: Object })
    other?: any;
}

export const CertificateTemplateSchema = SchemaFactory.createForClass(CertificateTemplate);

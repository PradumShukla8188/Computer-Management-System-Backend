
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EmailTemplateDocument = HydratedDocument<EmailTemplate>;

@Schema({ timestamps: true })
export class EmailTemplate {
    @Prop({ required: true, trim: false })
    uid: string;

    @Prop({ required: true, trim: true, default: '' })
    subject: string;

    @Prop({ required: true })
    html: string;

    @Prop({ required: false, default: null })
    deletedAt: Date;

}

export const EmailTemplateSchema = SchemaFactory.createForClass(EmailTemplate);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoticeDocument = Notice & Document;

@Schema({ timestamps: true })
export class Notice {
    @Prop({ required: true, trim: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const NoticeSchema = SchemaFactory.createForClass(Notice);

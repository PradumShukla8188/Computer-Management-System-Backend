import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OptionDocument = HydratedDocument<Option>;
@Schema({ timestamps: true })
export class Option {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }) questionId: mongoose.Types.ObjectId;
    @Prop({ required: true }) text: string;
    @Prop({ default: false }) isCorrect: boolean;
}

export const OptionSchema = SchemaFactory.createForClass(Option);

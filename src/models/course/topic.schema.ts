import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type TopicDocument = HydratedDocument<Topic>;

@Schema({ timestamps: true })
export class Topic {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true })
    moduleId: mongoose.Types.ObjectId;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);

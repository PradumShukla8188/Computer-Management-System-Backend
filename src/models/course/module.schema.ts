import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema({ timestamps: true })
export class Module {
    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true })
    courseId: mongoose.Types.ObjectId;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }] })
    topics: mongoose.Types.ObjectId[];
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

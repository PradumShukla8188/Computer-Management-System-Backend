import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type AttemptDocument = HydratedDocument<Attempt>;

@Schema({ timestamps: true })
export class Attempt {
    @Prop({ required: true }) examId: mongoose.Types.ObjectId;
    @Prop({ required: true }) userId: mongoose.Types.ObjectId;
    @Prop() rollNumber?: string;
    @Prop() email?: string;

    @Prop() startedAt: Date;
    @Prop() finishedAt?: Date;

    @Prop({
        type: [{
            questionId: mongoose.Schema.Types.ObjectId,
            optionId: mongoose.Schema.Types.ObjectId, // for MCQ
            typingText: String,
            subjectiveText: String,
            score: Number
        }]
    })
    answers: any[];

    @Prop({ default: 0 }) totalScore: number;
    @Prop({ default: false }) passed: boolean;
    @Prop() evaluatedAt?: Date;

    @Prop() deletedAt?: Date;
}

export const AttemptSchema = SchemaFactory.createForClass(Attempt);

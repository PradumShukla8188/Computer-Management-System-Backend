import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GeneralStatus } from 'src/constants/enum';
import { User } from '../user/user.schema';
import * as mongoose from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true, trim: true })
    eventName: string;

    @Prop({ required: true, trim: true })
    category: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: false, default: '' })
    banner: string;

    @Prop({ required: true })
    eventDate: Date;

    @Prop({ required: true })
    registrationStartDate: Date;

    @Prop({ required: true })
    registrationEndDate: Date;

    @Prop({ required: true, trim: true })
    venue: string;

    @Prop({ required: true, trim: true })
    organizerName: string;

    @Prop({ required: true, min: 1 })
    maxParticipants: number;

    @Prop({ type: String, enum: GeneralStatus, default: GeneralStatus.Active })
    status: GeneralStatus;

    @Prop({ required: false, default: null })
    deletedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdBy: User;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    updatedBy: User;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);

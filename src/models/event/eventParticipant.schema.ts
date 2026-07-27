import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GeneralStatus } from 'src/constants/enum';
import { Event } from './event.schema';
import { User } from '../user/user.schema';
import * as mongoose from 'mongoose';

export type EventParticipantDocument = HydratedDocument<EventParticipant>;

class FileObject {
    @Prop({ required: true })
    fileUrl: string;

    @Prop({ required: false })
    fileName: string;
}

@Schema({ timestamps: true })
export class EventParticipant {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true })
    eventId: Event;

    @Prop({ required: true, trim: true })
    fullName: string;

    @Prop({ required: true, trim: true })
    fatherName: string;

    @Prop({ required: true, trim: true })
    motherName: string;

    @Prop({ required: true })
    dob: Date;

    @Prop({ required: true, trim: true })
    mobileNumber: string;

    @Prop({ required: true, trim: true })
    srNumber: string;

    @Prop({ required: true, trim: true, unique: true })
    rollNumber: string;

    @Prop({ required: true })
    profilePhoto: string;

    @Prop({ required: false, trim: true })
    aadhaarNumber: string;

    @Prop({ required: false })
    aadhaarImage: string;

    @Prop({ required: false, trim: true })
    email: string;

    @Prop({ type: [Object], required: false, default: [] })
    marksheets: any[]; // Array of FileObject or similar

    @Prop({ required: false, unique: true, sparse: true })
    certificateNumber: string;

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

export const EventParticipantSchema = SchemaFactory.createForClass(EventParticipant);

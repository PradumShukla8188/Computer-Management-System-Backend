import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Institute } from '../institute/institute.schema';
import { PaymentTransaction } from '../payments/paymentTransaction.schema';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true })
    instituteId: Institute;

    @Prop({ required: true, trim: true })
    planName: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true, enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'], default: 'ACTIVE' })
    status: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PaymentTransaction', required: true })
    paymentId: PaymentTransaction;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

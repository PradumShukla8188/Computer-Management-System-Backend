import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Student } from '../student/student.schema';
import { Institute } from '../institute/institute.schema';
import { PaymentType } from 'src/constants/enum';

export type PaymentTransactionDocument = HydratedDocument<PaymentTransaction>;

@Schema({ timestamps: true })
export class PaymentTransaction {
    @Prop({ required: true, enum: PaymentType })
    type: PaymentType;

    @Prop({ required: true, unique: true, trim: true })
    orderId: string;

    @Prop({ trim: true })
    txnId?: string; // Paytm Transaction ID

    @Prop({ trim: true })
    bankTxnId?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false })
    studentId?: Student;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true })
    instituteId: Institute;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ required: true, default: 0 })
    commissionAmount: number;

    @Prop({ required: true, default: 0 })
    instituteAmount: number;

    @Prop({ default: 'INR' })
    currency: string;

    @Prop({ 
        type: String, 
        enum: ['PENDING', 'TXN_SUCCESS', 'TXN_FAILURE', 'NO_PAYMENT'], 
        default: 'PENDING' 
    })
    status: string;

    @Prop()
    respMsg?: string;

    @Prop()
    respCode?: string;

    @Prop()
    paymentMode?: string;

    @Prop()
    gatewayName?: string;

    @Prop()
    txnDate?: Date;
}

export const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransaction);

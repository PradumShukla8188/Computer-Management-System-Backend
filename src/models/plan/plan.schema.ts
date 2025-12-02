
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GeneralStatus, PlanValidity } from 'src/constants/enum';

export type PlanDocument = HydratedDocument<Plan>;

@Schema({ timestamps: true })
export class Plan {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ required: true })
    price: number;

    // @Prop({ required: true })
    // features: string[];

    @Prop({ required: true, enum: PlanValidity })
    validity: PlanValidity;

    @Prop({ required: true, enum: GeneralStatus, default: GeneralStatus.Active })
    status: GeneralStatus;

    @Prop()
    createdAt?: Date

    @Prop()
    deleteAt?: Date

    @Prop()
    updatedAt?: Date
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
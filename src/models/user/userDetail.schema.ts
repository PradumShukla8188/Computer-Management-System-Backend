
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.schema';
import { Plan } from '../plan/plan.schema';
import { City } from '../country/cities.schema';
import { State } from '../country/states.schema';
import { Timezone } from '../country/timezone.schema';


export type UserDetailDocument = HydratedDocument<UserDetail>;

@Schema({ timestamps: true })
export class UserDetail {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
    userId: User;

    @Prop({ required: false, trim: true, default: null })
    accountNo: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Plan.name, required: false })
    planId: Plan;

    @Prop({ required: false, default: null })
    address: string

    @Prop({ required: false, default: null })
    address2: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: City.name, required: false, default: null })
    cityId: City;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: State.name, required: false, default: null })
    stateId: State;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Timezone.name, required: false, default: null })
    timezoneId: State;

    @Prop({ required: false, default: null })
    postalCode: string

    @Prop({ required: false, default: null })
    phn: string

    @Prop({ required: false, default: null })
    usDotNo: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: false })
    supportCenterId: User;

    @Prop({ required: false, default: null })
    description: string

    @Prop()
    createdAt?: Date

    @Prop()
    updatedAt?: Date

}

export const UserDetailSchema = SchemaFactory.createForClass(UserDetail);
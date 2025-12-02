
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Country } from './country.schema';

export type StateDocument = HydratedDocument<State>;

@Schema({ timestamps: true })
export class State {
    @Prop({ required: true, trim: true })
    id: number;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: false })
    state_code: string;

    @Prop({ required: false })
    latitude: string;

    @Prop({ required: false })
    longitude: string;

    @Prop({ required: true })
    countryId: number;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: Country.name })
    countryMId

}

export const StateSchema = SchemaFactory.createForClass(State);
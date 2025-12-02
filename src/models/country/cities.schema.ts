
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { State } from './states.schema';

export type CityDocument = HydratedDocument<City>;

@Schema({ timestamps: true })
export class City {
    @Prop({ required: true, trim: true })
    id: number;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true })
    latitude: string;

    @Prop({ required: true })
    longitude: string;

    @Prop({ required: true })
    stateId: number;

    @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: State.name })
    statemId
}

export const CitySchema = SchemaFactory.createForClass(City);
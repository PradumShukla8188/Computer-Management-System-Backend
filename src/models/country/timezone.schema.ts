
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TimezoneDocument = HydratedDocument<Timezone>;

@Schema({ timestamps: true })
export class Timezone {

    @Prop({ required: true, trim: true })
    zoneName: string;

    @Prop({ required: true })
    gmtOffset: number;

    @Prop({ required: true })
    gmtOffsetName: string;

    @Prop({ required: true })
    abbreviation: string;

    @Prop({ required: true })
    tzName: string;
}

export const TimezoneSchema = SchemaFactory.createForClass(Timezone);
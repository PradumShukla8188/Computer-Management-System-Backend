
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CountryDocument = HydratedDocument<Country>;

@Schema({ timestamps: true })
export class Country {
    @Prop({ required: true, unique: true })
    id: number;

    @Prop({ required: true, trim: true, })
    name: string;

    @Prop({ required: true, trim: true, })
    iso3: string;

    @Prop({ required: true, trim: true, })
    iso2: string;

    @Prop({ required: true, trim: true, })
    numeric_code: string;

    @Prop({ required: true, trim: true, })
    phone_code: string;

    @Prop({ required: false })
    capital: string;

    @Prop({ required: true, trim: true, })
    currency: string;

    @Prop({ required: true, trim: true, })
    currency_name: string;

    @Prop({ required: true, trim: true, })
    currency_symbol: string;

    @Prop({ required: true, trim: true, })
    tld: string;

    @Prop({ required: false })
    native: string;

    @Prop({ required: false })
    region: string;

    @Prop({ required: false })
    subregion: string;

    @Prop({ required: true, trim: true, })
    nationality: string;

    @Prop({ required: true, trim: true, })
    latitude: string;

    @Prop({ required: true, trim: true, })
    longitude: string;

    @Prop({ required: true, trim: true, })
    emoji: string;

    @Prop({ required: true, trim: true, })
    emojiU: string;

}

export const CountrySchema = SchemaFactory.createForClass(Country);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GeneralStatus } from '../../constants/enum';

export type CMSPageDocument = CMSPage & Document;

@Schema({ timestamps: true })
export class CMSPage extends Document {

    @Prop({ required: true, trim: true, unique: true })
    name: string;

    @Prop({ required: true, trim: true })
    description: string;

    @Prop({ trim: true })
    shortDescription?: string;

    @Prop({ required: true, trim: true })
    slug: string;

    @Prop({ trim: true })
    metaTitle?: string;

    @Prop({ trim: true })
    metaDescription?: string;

    @Prop({ trim: true })
    metaKeyword?: string;

    @Prop({ trim: true })
    metaContent?: string;

    @Prop({
        type: String,
        enum: Object.keys(GeneralStatus),
        default: GeneralStatus.Active,
    })
    status: GeneralStatus;
}

export const CMSPageSchema = SchemaFactory.createForClass(CMSPage);

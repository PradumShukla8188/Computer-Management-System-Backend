import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InstituteSettings extends Document {
    @Prop({ required: true })
    instituteName: string;

    @Prop({ required: true })
    siteName: string;

    @Prop()
    logoUrl: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: string;

    @Prop()
    website: string;

    @Prop()
    description: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const InstituteSettingsSchema =
    SchemaFactory.createForClass(InstituteSettings);

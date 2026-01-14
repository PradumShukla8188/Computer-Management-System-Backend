import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InstituteSettings extends Document {
    @Prop({ required: true })
    instituteName: string;

    @Prop()
    logo: string;

    @Prop({ required: true })
    instituteAddress: string;

    @Prop({ required: true })
    instituteEmail: string;

    @Prop({ required: true })
    instituteContact: string;

    @Prop()
    description: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const InstituteSettingsSchema =
    SchemaFactory.createForClass(InstituteSettings);

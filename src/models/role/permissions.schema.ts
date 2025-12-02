
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GeneralStatus } from 'src/constants/enum';

export type PermissionsDocument = HydratedDocument<Permissions>;

@Schema({ timestamps: true })
export class Permissions {
    @Prop({ required: true, trim: true, unique: true })
    name: string;

    @Prop({ required: true, trim: true })
    displayName: string;

    @Prop({ required: true, trim: true })
    group: string;

    @Prop({ required: true, default: 100 })
    order: number;

    @Prop({ type: String, enum: GeneralStatus, default: GeneralStatus.Active })
    status: GeneralStatus
}

export const PermissionsSchema = SchemaFactory.createForClass(Permissions);
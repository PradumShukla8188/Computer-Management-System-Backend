import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    displayName: string;

    @Prop({ default: true })
    isStatic: boolean;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
    companyId: User;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
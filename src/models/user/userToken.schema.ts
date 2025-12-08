
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserTokenType } from 'src/constants/enum';
import * as mongoose from 'mongoose';
import { User } from './user.schema';

export type UserTokenDocument = HydratedDocument<UserToken>;

@Schema({ timestamps: true })
export class UserToken {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;

    @Prop({ required: true, trim: true })
    token: string;

    @Prop({ required: true, trim: true, type: String, enum: UserTokenType })
    type: UserTokenType

    @Prop()
    createdAt?: Date

    @Prop()
    updatedAt?: Date

}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
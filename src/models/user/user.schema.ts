
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatus } from 'src/constants/enum';
import * as mongoose from 'mongoose';
import { Role } from '../role/role.schema';


export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, trim: true })
    firstName: string;

    @Prop({ required: false, trim: true, default: '' })
    lastName: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, enum: UserStatus, default: UserStatus.Active })
    status: UserStatus

    @Prop({ required: false })
    profilePic: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
    roleId: Role;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    superiorId: User;

    @Prop({ required: false })
    workPhone: string;

    @Prop({ required: false })
    mobilePhone: string;


    @Prop({ required: false, default: null })
    deletedAt: Date;

    @Prop()
    createdAt?: Date

    @Prop()
    updatedAt?: Date

}

export const UserSchema = SchemaFactory.createForClass(User);
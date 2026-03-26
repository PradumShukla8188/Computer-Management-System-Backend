import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Institute } from '../institute/institute.schema';
import { Role } from '../role/role.schema';
import { User } from './user.schema';

export type UserInstituteDocument = HydratedDocument<UserInstitute>;

@Schema({ timestamps: true })
export class UserInstitute {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Institute', required: true })
  instituteId: Institute;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true })
  roleId: Role;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const UserInstituteSchema = SchemaFactory.createForClass(UserInstitute);

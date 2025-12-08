
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Role } from './role.schema';
import { Permissions } from './permissions.schema';

export type RolePermissionsDocument = HydratedDocument<RolePermissions>;

@Schema({ timestamps: true })
export class RolePermissions {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Permissions', required: true })
    permissionId: Permissions;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true })
    roleId: Role;
}

export const RolePermissionsSchema = SchemaFactory.createForClass(RolePermissions);
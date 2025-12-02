import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString, MaxLength, ValidateNested } from "class-validator";

export class AddRole {
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    name: string
}

export class UpdateRole {
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({ each: true })
    permissions: string[]

    @IsNotEmpty()
    @IsMongoId()
    roleId: string
}

export class RoleDetail {
    @IsNotEmpty()
    @IsMongoId()
    roleId: string
}

export class RolePermissionDelete {
    @IsNotEmpty()
    @IsMongoId()
    id: string;
}

export class DeleteRolePermissionsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RolePermissionDelete)
    permissions: RolePermissionDelete[];
}
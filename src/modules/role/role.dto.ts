import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString, MaxLength, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddRole {
    @ApiProperty({ example: 'Manager', description: 'Name of the role' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    name: string
}

export class UpdateRole {
    @ApiProperty({ type: [String], example: ['657f1f77bcf86cd799439011'] })
    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @IsMongoId({ each: true })
    permissions: string[]

    @ApiProperty({ example: '657f1f77bcf86cd799439022' })
    @IsNotEmpty()
    @IsMongoId()
    roleId: string
}

export class RoleDetail {
    @ApiProperty({ example: '657f1f77bcf86cd799439022' })
    @IsNotEmpty()
    @IsMongoId()
    roleId: string
}

export class RolePermissionDelete {
    @ApiProperty({ example: '657f1f77bcf86cd799439033' })
    @IsNotEmpty()
    @IsMongoId()
    id: string;
}

export class DeleteRolePermissionsDto {
    @ApiProperty({ type: [RolePermissionDelete] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RolePermissionDelete)
    permissions: RolePermissionDelete[];
}
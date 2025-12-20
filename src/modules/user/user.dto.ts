import { Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { UserStatus } from "src/constants/enum";
import { PartialType, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChangePassward {
    @ApiProperty({ example: 'OldPassword123!', description: 'Current password' })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    oldPassword: string;

    @ApiProperty({ example: 'NewPassword123!', description: 'New password' })
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    newPassword: string;
}

export class StatesList {
    @ApiPropertyOptional({ example: 'USA' })
    @IsOptional()
    @IsString()
    countryName?: string
}

export class CityList {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsString()
    stateId: string
}

export class UpdateProfileA {
    @ApiPropertyOptional({ example: '/path/to/profile.jpg' })
    @IsOptional()
    @IsString()
    profilePic: string;

    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    firstName: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(35)
    lastName: string;
}

export class AssetTags {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    tagId: string

    @ApiProperty({ example: 'Tag Value' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    value: string
}

export class AddUser {
    @ApiProperty({ example: 'John' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    lastName: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsNotEmpty()
    @IsString()
    // @IsEmail() 

    email: string;

    @ApiPropertyOptional({ example: '1234567890' })
    @IsOptional()
    @IsString()
    @MaxLength(25)
    workPhone: string;

    @ApiPropertyOptional({ example: '0987654321' })
    @IsOptional()
    @IsString()
    @MaxLength(25)
    mobilePhone: string;

    @ApiProperty({ enum: UserStatus, example: UserStatus.Active })
    @IsNotEmpty()
    @IsString()
    @IsIn(Object.keys(UserStatus))
    status: UserStatus;

    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    roleId: string;

    @ApiPropertyOptional({ example: '657f1f77bcf86cd799439012' })
    @IsOptional()
    @IsString()
    @IsMongoId()
    classId?: string;

    @ApiPropertyOptional({ example: '657f1f77bcf86cd799439013' })
    @IsOptional()
    @IsString()
    @IsMongoId()
    regionId?: string;

    // @IsNotEmpty()
    // @IsString()
    // @IsMongoId()
    // timezoneId: string;

    @ApiPropertyOptional({ type: [AssetTags] })
    @IsOptional()
    @ValidateIf((object, value) => value)
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AssetTags)
    tags: AssetTags[];

    // @Transform(({ value }) => value?.trim() === '' ? null : value)
    // @Transform(({ value }) => {
    //     console.log("Incoming password value:", value);
    //     return value === "" || value === null || value === undefined ? null : value;
    // })
    @ApiProperty({ example: 'SecurePassword123!' })
    @IsString()
    @IsNotEmpty({ message: 'Password is required.' })
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string;
}

export class UpdateUser extends PartialType(AddUser) {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    /**
     *  OPTIONAL ONLY FOR UPDATE
     */
    @IsOptional()
    @Transform(({ value }) => (value === '' ? undefined : value))
    @IsString()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1
    })
    password?: string;
}

export class ChangeUserPassward {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    @ApiProperty({ example: 'NewPassword123!' })
    @IsNotEmpty()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string;
}

export class ViewUser {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    id: string;
}

export class UpdateUserStatus {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    @ApiProperty({ enum: UserStatus, example: UserStatus.Active })
    @IsNotEmpty()
    @IsString()
    @IsIn(Object.keys(UserStatus))
    status: UserStatus;
}

export class UsersList {
    @ApiProperty({ example: 1, default: 1 })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    page: number;

    @ApiProperty({ example: 10, default: 10 })
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(10000)
    limit: number;

    @ApiPropertyOptional({ example: 'John' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    search: string;
}
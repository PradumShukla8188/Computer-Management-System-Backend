import { Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { UserStatus } from "src/constants/enum";
import { PartialType } from '@nestjs/mapped-types';

export class ChangePassward {
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    newPassword: string;
}

export class StatesList {
    @IsOptional()
    @IsString()
    countryName?: string
}

export class CityList {
    @IsNotEmpty()
    @IsString()
    stateId: string
}

export class UpdateProfileA {

    @IsOptional()
    @IsString()
    profilePic: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    firstName: string;

    @IsOptional()
    @IsString()
    @MaxLength(35)
    lastName: string;
}

export class AssetTags {
    @IsNotEmpty()
    @IsMongoId()
    tagId: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    value: string
}

export class AddUser {
    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    firstName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(35)
    lastName: string;

    @IsNotEmpty()
    @IsString()
    // @IsEmail() 

    email: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    workPhone: string;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    mobilePhone: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(Object.keys(UserStatus))
    status: UserStatus;

    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    roleId: string;

    @IsOptional()
    @IsString()
    @IsMongoId()
    classId?: string;

    @IsOptional()
    @IsString()
    @IsMongoId()
    regionId?: string;

    // @IsNotEmpty()
    // @IsString()
    // @IsMongoId()
    // timezoneId: string;

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
    @IsString()
    @IsNotEmpty({ message: 'Password is required.' })
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string;
}

export class UpdateUser extends PartialType(AddUser) {
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
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    @IsNotEmpty()
    @IsStrongPassword({ minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 })
    password: string;
}

export class ViewUser {
    @IsNotEmpty()
    @IsMongoId()
    id: string;
}

export class UpdateUserStatus {
    @IsNotEmpty()
    @IsMongoId()
    id: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(Object.keys(UserStatus))
    status: UserStatus;
}

export class UsersList {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    page: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(10000)
    limit: number;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    @Transform(({ value }) => value?.trim())
    search: string;
}
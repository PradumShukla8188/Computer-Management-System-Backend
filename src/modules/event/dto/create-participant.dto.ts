import { IsString, IsNotEmpty, IsOptional, IsDateString, IsEnum, IsArray } from 'class-validator';
import { GeneralStatus } from 'src/constants/enum';

export class CreateParticipantDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    fatherName: string;

    @IsString()
    @IsNotEmpty()
    motherName: string;

    @IsDateString()
    @IsNotEmpty()
    dob: string;

    @IsString()
    @IsNotEmpty()
    mobileNumber: string;

    @IsString()
    @IsNotEmpty()
    srNumber: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    aadhaarNumber?: string;

    @IsString()
    @IsOptional()
    profilePhoto?: string;

    @IsString()
    @IsOptional()
    aadhaarImage?: string;

    @IsArray()
    @IsOptional()
    marksheets?: any[];
}

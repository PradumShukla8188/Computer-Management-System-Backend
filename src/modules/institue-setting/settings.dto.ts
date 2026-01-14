import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
} from 'class-validator';

export class CreateInstituteSettingsDto {
    @ApiProperty({ example: 'Elephant Foundry Institute' })
    @IsNotEmpty()
    @IsString()
    instituteName: string;

    @ApiProperty({ example: 'https://cdn.domain.com/logo.png', required: false })
    @IsOptional()
    @IsString()
    logo?: string;

    @ApiProperty({ example: 'Bangalore, Karnataka, India' })
    @IsNotEmpty()
    instituteAddress: string;

    @ApiProperty({ example: 'support@academy.com' })
    @IsEmail()
    instituteEmail: string;

    @ApiProperty({ example: '+91 9876543210' })
    @IsNotEmpty()
    instituteContact: string;


    @ApiProperty({ example: 'Best learning platform', required: false })
    @IsOptional()
    description?: string;
}

export class UpdateInstituteSettingsDto extends PartialType(
    CreateInstituteSettingsDto,
) { }
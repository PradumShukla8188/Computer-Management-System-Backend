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

    @ApiProperty({ example: 'Elephant Foundry Academy' })
    @IsNotEmpty()
    @IsString()
    siteName: string;

    @ApiProperty({ example: 'https://cdn.domain.com/logo.png', required: false })
    @IsOptional()
    @IsString()
    logoUrl?: string;

    @ApiProperty({ example: 'Bangalore, Karnataka, India' })
    @IsNotEmpty()
    address: string;

    @ApiProperty({ example: 'support@academy.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+91 9876543210' })
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'https://academy.com', required: false })
    @IsOptional()
    @IsUrl()
    website?: string;

    @ApiProperty({ example: 'Best learning platform', required: false })
    @IsOptional()
    description?: string;
}

export class UpdateInstituteSettingsDto extends PartialType(
    CreateInstituteSettingsDto,
) { }
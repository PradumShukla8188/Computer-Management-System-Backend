import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';
import { GeneralStatus } from '../../constants/enum';

export class CreateCMSPageDto {

    @ApiProperty({ example: 'About Us' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Full page description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ example: 'Short description' })
    @IsOptional()
    @IsString()
    shortDescription?: string;

    @ApiProperty({ example: 'about-us' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    metaTitle?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    metaDescription?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    metaKeyword?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    metaContent?: string;

    @ApiPropertyOptional({ enum: GeneralStatus })
    @IsOptional()
    @IsEnum(GeneralStatus)
    status?: GeneralStatus;
}


export class UpdateCMSPageDto extends PartialType(CreateCMSPageDto) { }
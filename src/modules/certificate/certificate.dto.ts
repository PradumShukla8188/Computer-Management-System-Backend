import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
    IsArray,
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsObject,
    IsOptional,
    IsString,
    IsNumber,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TemplateDimensionDto {
    @ApiPropertyOptional({ example: 1123 })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    width: number;

    @ApiPropertyOptional({ example: 794 })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    height: number;
}

export class CreateCertificateTemplateDto {
    @ApiProperty({ example: 'Default Certificate Template' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({ type: [Object] })
    @IsOptional()
    @IsArray()
    design?: any[];

    @ApiPropertyOptional({ type: TemplateDimensionDto })
    @IsOptional()
    @IsObject()
    dimensions?: TemplateDimensionDto;

    @ApiPropertyOptional({ example: 'data:image/png;base64,...' })
    @IsOptional()
    @IsString()
    backgroundImage?: string;

    @ApiPropertyOptional({ default: true })
    @IsOptional()
    isActive?: boolean;
}

export class UpdateCertificateTemplateDto extends PartialType(CreateCertificateTemplateDto) { }

export class IssueCertificateDto {
    @ApiProperty({ example: '67a8adf12cc909d4df0f9e02' })
    @IsMongoId()
    studentId: string;

    @ApiProperty({ example: '67a8adf12cc909d4df0f9e03' })
    @IsMongoId()
    templateId: string;

    @ApiPropertyOptional({ type: Object })
    @IsOptional()
    @IsObject()
    data?: Record<string, any>;
}

export enum CertificateSearchType {
    Roll = 'roll',
    Name = 'name',
}

export class SearchCertificateDto {
    @ApiProperty({ example: 'PTCE/2024/001' })
    @IsString()
    @IsNotEmpty()
    search: string;

    @ApiPropertyOptional({ enum: CertificateSearchType, default: CertificateSearchType.Roll })
    @IsOptional()
    @IsEnum(CertificateSearchType)
    searchType?: CertificateSearchType;
}

import { IsString, IsNotEmpty, IsObject, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCertificateTemplateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  design: any;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  dimensions: { width: number; height: number };

  @ApiProperty()
  @IsString()
  @IsOptional()
  backgroundImage?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  placeholders?: string[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

export class IssueCertificateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  data: Record<string, string>;

  @ApiProperty()
  @IsString()
  @IsOptional()
  certificateNumber?: string;
}

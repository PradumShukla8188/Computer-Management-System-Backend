import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNoticeDto {
    @ApiProperty({ example: 'New Courses Available' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'Software, Hardware, Web Design courses available' })
    @IsString()
    description: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
export class UpdateNoticeDto extends PartialType(
    CreateNoticeDto,
) { }

export class ListDTO {
    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;

    @ApiPropertyOptional({ example: 'search' })
    @IsOptional()
    @IsString()
    search?: string;
}
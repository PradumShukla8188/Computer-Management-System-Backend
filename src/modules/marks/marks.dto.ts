import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class SubjectMarksDto {
    @ApiProperty({ example: '6964a23b7e815ce5221337f9' })
    @IsMongoId()
    subjectId: string;

    @ApiProperty({ example: 100 })
    @Type(() => Number)
    @IsNumber()
    totalMarks: number;

    @ApiProperty({ example: 85 })
    @Type(() => Number)
    @IsNumber()
    obtainedMarks: number;
}


export class CreateStudentMarkDto {

    @ApiProperty({ example: '657f1f77bcf86cd799439011', description: 'Student ID' })
    @IsMongoId()
    studentId: string;

    @ApiProperty({ example: '657f1f77bcf86cd799439022', description: 'Course ID' })
    @IsMongoId()
    courseId: string;

    @ApiProperty({ type: [SubjectMarksDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SubjectMarksDto)
    subjects: SubjectMarksDto[];

    @ApiProperty({ example: 'Monthly Test', description: 'Exam Name' })
    @IsString()
    @IsNotEmpty()
    examName: string;

    @ApiProperty({ example: true, required: false, description: 'Whether the marks are visible to students' })
    @IsOptional()
    isPublished?: boolean;
}

export class UpdateStudentMarkDto extends PartialType(SubjectMarksDto) {
    @ApiProperty({ example: '657f1f77bcf86cd799439044', description: 'Mark ID' })
    // @IsMongoId()
    id: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    isPublished?: boolean;
}

export class SearchPublicMarksheetDto {
    @ApiProperty({ example: '12345678' })
    @IsString()
    @IsNotEmpty()
    search: string;

    @ApiProperty({ example: 'roll', enum: ['roll', 'name'], required: false })
    @IsOptional()
    @IsIn(['roll', 'name'])
    searchType?: 'roll' | 'name';
}

export class DownloadMarksheetDto {
    @ApiProperty({ example: '67f1f77bcf86cd799439011' })
    @IsMongoId()
    studentId: string;

    @ApiProperty({ example: 'Final Exam', required: false })
    @IsOptional()
    @IsString()
    examName?: string;
}

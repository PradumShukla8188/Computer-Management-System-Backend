import {
    IsBoolean,
    IsDateString,
    IsEnum,
    IsMongoId,
    IsNumber,
    IsOptional,
    IsString,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExamMode, ExamType } from 'src/constants/enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateOptionDto {
    @ApiProperty({ example: 'Option A text' })
    @IsString()
    text: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    isCorrect: boolean;
}

class CreateQuestionDto {
    @ApiProperty({ example: 'What is the capital of France?' })
    @IsString()
    text: string;

    @ApiProperty({ example: 5 })
    @IsNumber()
    marks: number;

    // @ApiProperty({ example: { difficulty: 'easy' } })
    // @IsString()
    // meta: string;

    @ApiProperty({ type: [CreateOptionDto] })
    @ValidateNested({ each: true })
    @Type(() => CreateOptionDto)
    options: CreateOptionDto[];
}

export class CreateExamDto {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsMongoId()
    courseId: string;

    @ApiProperty({ example: 'Final Semester Exam' })
    @IsString()
    title: string;

    @ApiProperty({ example: 'OBJECTIVE' })
    @IsEnum(ExamType)
    type: ExamType;

    @ApiProperty({ example: 'OBJECTIVE' })
    @IsEnum(ExamMode)
    mode: ExamMode;

    @ApiProperty({ example: 60 })
    @Type(() => Number)
    @IsNumber()
    durationMinutes: number;

    @ApiProperty({ example: 100 })
    @Type(() => Number)
    @IsNumber()
    totalMarks: number;

    @ApiProperty({ example: 40 })
    @Type(() => Number)
    @IsNumber()
    passMarks: number;

    @ApiProperty({ example: true })
    @IsBoolean()
    negativeMarking: boolean;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    negativeMarksPerQuestion: number;

    @ApiProperty({ example: '2023-06-01' })
    @IsDateString()
    examDate: string;

    @ApiProperty({ example: '10:00 AM' })
    @IsString()
    startTime: string;

    @ApiProperty({ example: '11:00 AM' })
    @IsString()
    endTime: string;

    @ValidateNested({ each: true })
    @Type(() => CreateQuestionDto)
    questions: CreateQuestionDto[];
}

export class GetExamListDto {
    @ApiPropertyOptional({ description: 'Page number for pagination', example: 1 })
    @IsOptional()
    @Type(() => Number) // converts query string to number
    @IsNumber()
    @Min(1)
    page?: number;

    @ApiPropertyOptional({ description: 'Number of exams per page', example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number;

    @ApiPropertyOptional({ description: 'Filter exams by course ID' })
    @IsOptional()
    @IsString()
    courseId?: string;

    @ApiPropertyOptional({ description: 'Filter exams by title (partial match)' })
    @IsOptional()
    @IsString()
    title?: string;
}
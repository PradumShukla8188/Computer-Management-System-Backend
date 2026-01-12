import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

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
}

export class UpdateStudentMarkDto extends PartialType(SubjectMarksDto) {
    @ApiProperty({ example: '657f1f77bcf86cd799439044', description: 'Mark ID' })
    // @IsMongoId()
    id: string;
}

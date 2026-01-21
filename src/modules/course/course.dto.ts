import { IsDateString, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested, IsArray } from "class-validator";
import { Gender, Religion, Category, ExamMode, GeneralStatus, UserStatus } from "src/constants/enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from 'class-transformer';

class TopicDTO {
    @ApiProperty({ example: 'Introduction to React' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'Basic concepts of components and props' })
    @IsOptional()
    @IsString()
    description?: string;
}

class SyllabusDTO {
    @ApiProperty({ example: 'Frontend Fundamentals' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: 'HTML, CSS, and JS basics' })
    @IsOptional()
    @IsString()
    description?: string;

    // @ApiProperty({ type: [TopicDTO] })
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => TopicDTO)
    // topics: TopicDTO[];
}

export class CreateCourseDTO {
    @ApiProperty({ example: 'Full Stack Web Development' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'MERN-2024' })
    @IsNotEmpty()
    @IsString()
    shortName: string;

    @ApiProperty({ example: 'Comprehensive course on MERN stack', description: 'Detailed course description' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: 6, description: 'Duration in months' })
    @IsNumber()
    durationInMonths: number;

    @ApiProperty({ example: 5000, description: 'Monthly fee' })
    @IsNumber()
    monthlyFees: number;

    @ApiProperty({ type: [SyllabusDTO] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SyllabusDTO)
    subjects: SyllabusDTO[];
}

export class GetCourse {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string
}

export class UpdateCourseDTO extends CreateCourseDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string
}



export class UpdateCourseStatusDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @ApiProperty({ enum: GeneralStatus, example: GeneralStatus.Active })
    @IsNotEmpty()
    @IsEnum(GeneralStatus)
    status: UserStatus;
}


export class DeleteCourseDTO {

    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string
}

export class GetCourseListDTO {
    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number = 10;
}
// export class CreateCourseDTO {
//     name: string;
//     shortName: string;
//     description: string;
//     durationInMonths: number;
//     monthlyFees: number;

//     syllabus: {
//         title: string;
//         description?: string;
//         topics: { name: string; description?: string }[];
//     }[];
// }

export class GetSubjectListDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    courseId: string
}



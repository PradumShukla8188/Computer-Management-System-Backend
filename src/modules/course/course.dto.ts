import { IsDateString, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min, ValidateNested, IsArray } from "class-validator";
import { Gender, Religion, Category, ExamMode, GeneralStatus, UserStatus } from "src/constants/enum";
import { Type } from 'class-transformer';

class TopicDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}

class SyllabusDTO {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TopicDTO)
    topics: TopicDTO[];
}

export class CreateCourseDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    shortName: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNumber()
    durationInMonths: number;

    @IsNumber()
    monthlyFees: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SyllabusDTO)
    syllabus: SyllabusDTO[];
}

export class GetCourse {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string
}

export class UpdateCourseDTO extends CreateCourseDTO {
    @IsNotEmpty()
    @IsMongoId()
    _id: string
}



export class UpdateCourseStatusDTO {
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @IsNotEmpty()
    @IsEnum(GeneralStatus)
    status: UserStatus;
}


export class DeleteCourseDTO {

    @IsNotEmpty()
    @IsMongoId()
    _id: string
}

export class GetCourseListDTO {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number = 1;

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


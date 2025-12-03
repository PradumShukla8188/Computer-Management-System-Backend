import { IsDateString, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { Gender, Religion, Category, ExamMode, GeneralStatus } from "src/constants/enum";

export class CreateStudentDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    fatherName: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    motherName: string;

    @IsNotEmpty()
    @IsDateString()
    dob: Date;

    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;

    @IsNotEmpty()
    @IsString()
    @MaxLength(15)
    mobile: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    residentialAddress: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    district: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    pinCode: string;

    @IsNotEmpty()
    @IsEnum(Religion)
    religion: Religion;

    @IsNotEmpty()
    @IsEnum(Category)
    category: Category;

    @IsNotEmpty()
    @IsDateString()
    dateOfAdmission: Date;

    @IsNotEmpty()
    @IsString()
    selectedCourse: string;

    @IsNotEmpty()
    @IsString()
    courseDuration: string;

    @IsNotEmpty()
    @IsString()
    session: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    totalFees: number;

    @IsNotEmpty()
    @IsEnum(ExamMode)
    examMode: ExamMode;

    // Optional File Upload Fields (string paths)
    @IsOptional()
    @IsString()
    studentPhoto?: string;

    @IsOptional()
    @IsString()
    uploadEducationProof?: string;

    @IsOptional()
    @IsString()
    uploadIdentityProof?: string;
}

export class GetStudent {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string
}

export class UpdateStudentDTO {
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    fatherName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    motherName?: string;

    @IsOptional()
    @IsDateString()
    dob?: Date;

    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsString()
    mobile?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    residentialAddress?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    district?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    pinCode?: string;

    @IsOptional()
    @IsEnum(Religion)
    religion?: Religion;

    @IsOptional()
    @IsEnum(Category)
    category?: Category;

    @IsOptional()
    @IsDateString()
    dateOfAdmission?: Date;

    @IsOptional()
    @IsString()
    selectedCourse?: string;

    @IsOptional()
    @IsString()
    courseDuration?: string;

    @IsOptional()
    @IsString()
    session?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    totalFees?: number;

    @IsOptional()
    @IsEnum(ExamMode)
    examMode?: ExamMode;

    @IsOptional()
    @IsString()
    studentPhoto?: string;

    @IsOptional()
    @IsString()
    uploadEducationProof?: string;

    @IsOptional()
    @IsString()
    uploadIdentityProof?: string;
}


export class UpdateStudentStatusDTO {

    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @IsNotEmpty()
    @IsString()
    @IsEnum(GeneralStatus)
    status: GeneralStatus
}

export class DeleteStudentDTO {

    @IsNotEmpty()
    @IsMongoId()
    _id: string
}
import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, isMongoId, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender, Religion, Category, ExamMode, GeneralStatus } from "src/constants/enum";

export class CreateStudentDTO {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the student' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @ApiProperty({ example: 'Michael Doe', description: 'Father\'s name' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    fatherName: string;

    @ApiProperty({ example: 'Jane Doe', description: 'Mother\'s name' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    motherName: string;

    @ApiProperty({ example: '2005-08-15', description: 'Date of Birth (ISO 8601)' })
    @IsNotEmpty()
    @IsDateString()
    dob: Date;

    @ApiProperty({ enum: Gender, example: Gender.Male })
    @IsNotEmpty()
    @IsEnum(Gender)
    gender: Gender;

    @ApiProperty({ example: '9876543210', description: 'Mobile number' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(15)
    mobile: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123 Main St, Springfield' })
    @IsNotEmpty()
    @IsString()
    residentialAddress: string;

    @ApiProperty({ example: 'Illinois' })
    @IsNotEmpty()
    @IsString()
    state: string;

    @ApiProperty({ example: 'Sangamon' })
    @IsNotEmpty()
    @IsString()
    district: string;

    @ApiProperty({ example: 'USA' })
    @IsNotEmpty()
    @IsString()
    country: string;

    @ApiProperty({ example: '62704' })
    @IsNotEmpty()
    @IsString()
    pinCode: string;

    @ApiProperty({ enum: Religion, example: Religion.Hindu })
    @IsNotEmpty()
    @IsEnum(Religion)
    religion: Religion;

    @ApiProperty({ enum: Category, example: Category.General })
    @IsOptional()
    @IsEnum(Category)
    category: Category;

    @ApiProperty({ example: '2023-09-01', description: 'Admission Date' })
    @IsNotEmpty()
    @IsDateString()
    dateOfAdmission: Date;

    @ApiProperty({ example: '64b2d1d0b1d0b1d0b1d0b1d0', description: 'Course ID' })
    @IsNotEmpty()
    @IsMongoId()
    courseId: string;

    @ApiProperty({ example: '4 Years' })
    @IsNotEmpty()
    @IsString()
    courseDuration: string;

    @ApiProperty({ example: '2023-2027' })
    @IsNotEmpty()
    @IsString()
    session: string;

    @ApiProperty({ example: 50000, description: 'Total fees amount' })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    totalFees: number;

    @ApiProperty({ enum: ExamMode, example: ExamMode.Online })
    @IsNotEmpty()
    @IsEnum(ExamMode)
    examMode: ExamMode;

    // Optional File Upload Fields (string paths)
    @ApiPropertyOptional({ example: '/uploads/photos/john.jpg' })
    @IsOptional()
    @IsString()
    studentPhoto?: string;

    @ApiPropertyOptional({ example: '/uploads/docs/edu_proof.pdf' })
    @IsOptional()
    @IsString()
    uploadEducationProof?: string;

    @ApiPropertyOptional({ example: '/uploads/docs/id_proof.jpg' })
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
    @ApiProperty({ example: '507f1f77bcf86cd799439011', description: 'Student MongoID' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @ApiPropertyOptional({ example: 'John Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @ApiPropertyOptional({ example: 'Michael Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fatherName?: string;

    @ApiPropertyOptional({ example: 'Jane Doe' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    motherName?: string;

    @ApiPropertyOptional({ example: '2005-08-15' })
    @IsOptional()
    @IsDateString()
    dob?: Date;

    @ApiPropertyOptional({ enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @ApiPropertyOptional({ example: '9876543210' })
    @IsOptional()
    @IsString()
    mobile?: string;

    @ApiPropertyOptional({ example: 'john.doe@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: '123 Main St' })
    @IsOptional()
    @IsString()
    residentialAddress?: string;

    @ApiPropertyOptional({ example: 'Illinois' })
    @IsOptional()
    @IsString()
    state?: string;

    @ApiPropertyOptional({ example: 'Sangamon' })
    @IsOptional()
    @IsString()
    district?: string;

    @ApiPropertyOptional({ example: 'USA' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ example: '62704' })
    @IsOptional()
    @IsString()
    pinCode?: string;

    @ApiPropertyOptional({ enum: Religion })
    @IsOptional()
    @IsEnum(Religion)
    religion?: Religion;

    @ApiPropertyOptional({ enum: Category })
    @IsOptional()
    @IsEnum(Category)
    category?: Category;

    @ApiPropertyOptional({ example: '2023-09-01' })
    @IsOptional()
    @IsDateString()
    dateOfAdmission?: Date;

    @ApiPropertyOptional({ example: 'Computer Science' })
    @IsOptional()
    @IsString()
    courseId?: string;

    @ApiPropertyOptional({ example: '4 Years' })
    @IsOptional()
    @IsString()
    courseDuration?: string;

    @ApiPropertyOptional({ example: '2023-2027' })
    @IsOptional()
    @IsString()
    session?: string;

    @ApiPropertyOptional({ example: 50000 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    totalFees?: number;

    @ApiPropertyOptional({ enum: ExamMode })
    @IsOptional()
    @IsEnum(ExamMode)
    examMode?: ExamMode;

    @ApiPropertyOptional({ example: '/path/to/photo.jpg' })
    @IsOptional()
    @IsString()
    studentPhoto?: string;

    @ApiPropertyOptional({ example: '/path/to/edu.pdf' })
    @IsOptional()
    @IsString()
    uploadEducationProof?: string;

    @ApiPropertyOptional({ example: '/path/to/id.jpg' })
    @IsOptional()
    @IsString()
    uploadIdentityProof?: string;
}


export class UpdateStudentStatusDTO {

    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @ApiProperty({ enum: GeneralStatus, example: GeneralStatus.Active })
    @IsNotEmpty()
    @IsString()
    @IsEnum(GeneralStatus)
    status: GeneralStatus
}

export class DeleteStudentDTO {

    @ApiProperty({ example: '507f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string
}

export class GetStudentListDTO {
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

/**student fees dto */
export class CreateFeesDTO {
    @ApiProperty({ example: 5000, description: 'Fee amount' })
    amount: number;

    @ApiProperty({ example: '657f1f77bcf86cd799439012', description: 'Course ID' })
    courseId: string;

    @ApiProperty({ example: '657f1f77bcf86cd799439013', description: 'User ID (Creator)' })
    userId: string;

    @ApiProperty({ example: '657f1f77bcf86cd799439011', description: 'Student ID' })
    studentId: string;
}
export class UpdateFeesDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439099', description: 'Fee ID' })
    _id: string;

    @ApiPropertyOptional({ example: 5000 })
    amount?: number;

    @ApiPropertyOptional({ example: '657f1f77bcf86cd799439012' })
    courseId?: string;

    @ApiPropertyOptional({ example: '657f1f77bcf86cd799439013' })
    userId?: string;

    @ApiPropertyOptional({ example: '657f1f77bcf86cd799439011' })
    studentId?: string;
}
export class DeleteFeesDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439099' })
    _id: string;
}
export class GetFeesDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439099' })
    _id: string;
}


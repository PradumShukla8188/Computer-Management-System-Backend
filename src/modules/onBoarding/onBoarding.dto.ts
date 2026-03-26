import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDTO {
    @ApiProperty({
        example: 'admin@yopmail.com',
        required: true
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'Admin@123',
        required: true
    })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({
        example: '67f0b3f8a1234567890abcde',
        required: false
    })
    @IsOptional()
    @IsString()
    instituteId?: string;
}

export class ForgotPasswordDTO {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
}


export class VerifyResetTokenDTO {
    @ApiProperty({ example: 'abcdef123456' })
    @IsNotEmpty()
    @IsString()
    token: string
}

export class ResetPassDTO {
    @ApiProperty({ example: 'abcdef123456' })
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'NewPass123!' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'NewPass123!' })
    @IsNotEmpty()
    @MinLength(6)
    confirmPassword: string;
}

export class AdminSelectInstituteDTO {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    @IsNotEmpty()
    @IsString()
    preAuthToken: string;

    @ApiProperty({ example: '67f0b3f8a1234567890abcde' })
    @IsNotEmpty()
    @IsString()
    instituteId: string;
}
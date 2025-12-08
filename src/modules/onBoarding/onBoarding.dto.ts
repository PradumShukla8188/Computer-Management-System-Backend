import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
}

export class ForgotPasswordDTO {
    @IsEmail()
    email: string;
}


export class VerifyResetTokenDTO {
    @IsNotEmpty()
    @IsString()
    token: string
}

export class ResetPassDTO {
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @MinLength(6)
    confirmPassword: string;
}
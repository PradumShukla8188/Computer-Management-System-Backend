import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString, IsEnum, Min } from 'class-validator';
import { GeneralStatus } from 'src/constants/enum';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    eventName: string;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsOptional()
    banner?: string;

    @IsDateString()
    @IsNotEmpty()
    eventDate: string;

    @IsDateString()
    @IsNotEmpty()
    registrationStartDate: string;

    @IsDateString()
    @IsNotEmpty()
    registrationEndDate: string;

    @IsString()
    @IsNotEmpty()
    venue: string;

    @IsString()
    @IsNotEmpty()
    organizerName: string;

    @IsNumber()
    @Min(1)
    maxParticipants: number;

    @IsEnum(GeneralStatus)
    @IsOptional()
    status?: GeneralStatus;
}

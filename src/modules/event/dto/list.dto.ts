import { IsOptional, IsString } from 'class-validator';

export class ListDTO {
    @IsOptional()
    page?: number;

    @IsOptional()
    limit?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

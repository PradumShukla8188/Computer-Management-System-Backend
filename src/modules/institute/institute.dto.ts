import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from 'class-transformer';

export class CreateInstituteDTO {
    @ApiProperty({ example: 'ABC Institute of Technology' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: '657f1f77bcf86cd799439011', description: 'Owner user ID' })
    @IsNotEmpty()
    @IsMongoId()
    ownerId: string;

    @ApiPropertyOptional({ example: 'abc-institute' })
    @IsOptional()
    @IsString()
    subdomain?: string;

    @ApiPropertyOptional({ example: 5, description: 'Platform commission percentage' })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    commissionPercentage?: number;
}

export class UpdateInstituteDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @ApiPropertyOptional({ example: 'ABC Institute of Technology' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 'abc-institute' })
    @IsOptional()
    @IsString()
    subdomain?: string;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    commissionPercentage?: number;
}

export class UpdateInstituteStatusDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string;

    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    isActive: boolean;
}

export class GetInstituteDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string;
}

export class DeleteInstituteDTO {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    @IsNotEmpty()
    @IsMongoId()
    _id: string;
}

export class GetInstituteListDTO {
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

    @ApiPropertyOptional({ example: 'abc' })
    @IsOptional()
    @IsString()
    search?: string;
}

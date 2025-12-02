import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";
import { GeneralStatus, PlanValidity } from "src/constants/enum";

export class CreatePlanDTO {
    @IsNotEmpty()
    @IsString()
    @MaxLength(25)
    name: string

    @IsNotEmpty()
    @IsString()
    @MaxLength(200)
    description: string

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    price: number

    @IsNotEmpty()
    @IsEnum(PlanValidity)
    validity: PlanValidity

    // @IsNotEmpty()
    // @IsArray()
    // @ArrayMinSize(1)
    // @IsString({ each: true })
    // @MinLength(3, { each: true })
    // features: string[]
}

export class GetPlan {
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    id: string
}

export class UpdatePlanDTO {

    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @IsOptional()
    @IsString()
    @MaxLength(25)
    name: string

    @IsOptional()
    @IsString()
    @MaxLength(200)
    description: string

    @IsOptional()
    @IsNumber()
    @Min(1)
    price: number

    @IsOptional()
    @IsEnum(PlanValidity)
    validity: PlanValidity
}

export class UpdatePlanStatusDTO {

    @IsNotEmpty()
    @IsMongoId()
    _id: string

    @IsNotEmpty()
    @IsString()
    @IsEnum(GeneralStatus)
    status: GeneralStatus
}

export class DeletePlanDTO {

    @IsNotEmpty()
    @IsMongoId()
    _id: string
}
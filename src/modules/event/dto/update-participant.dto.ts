import { PartialType } from '@nestjs/swagger';
import { CreateParticipantDto } from './create-participant.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { GeneralStatus } from 'src/constants/enum';

export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {
    @IsEnum(GeneralStatus)
    @IsOptional()
    status?: GeneralStatus;
}

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { InstituteController } from './institute.controller';
import { InstituteService } from './institute.service';
import { SharedModule } from 'src/services/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  controllers: [InstituteController],
  providers: [InstituteService],
})
export class InstituteModule {}

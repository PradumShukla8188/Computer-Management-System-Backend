import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { InstituteController } from './institute.controller';
import { InstituteService } from './institute.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InstituteController],
  providers: [InstituteService],
})
export class InstituteModule {}

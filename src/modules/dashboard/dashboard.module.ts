import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SharedModule } from 'src/services/shared.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }

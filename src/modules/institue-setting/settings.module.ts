import { Module } from '@nestjs/common';
import { InstituteSettingsController } from './settings.controller';
import { InstituteSettingsService } from './settings.service';
import { DatabaseModule } from '../database/database.module';


@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        InstituteSettingsController,
    ],
    providers: [InstituteSettingsService],
})
export class InstituteSettingsModule { }

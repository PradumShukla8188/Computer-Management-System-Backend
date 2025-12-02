import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule.register({ timeout: 5000 })
    ],
    providers: [
        CachingService
    ],
    exports: [
        HttpModule,
        CachingService,
    ],
})
export class SharedModule { }

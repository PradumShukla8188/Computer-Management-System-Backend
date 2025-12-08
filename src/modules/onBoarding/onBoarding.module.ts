import { Module } from "@nestjs/common";
import { OnBoardingController } from "./onBoarding.controller";
import { OnBoardingService } from "./onBording.service";
import { DatabaseModule } from "../database/database.module";
import { CommonService } from "src/services/common.service";
import { SendmailService } from "src/services/mail.service";
import { CachingService } from "src/services/caching.service";

@Module({
    imports: [DatabaseModule],
    controllers: [OnBoardingController],
    providers: [
        OnBoardingService,
        CommonService,
        SendmailService,
        CachingService
    ]
})
export class OnBoardingModule { }
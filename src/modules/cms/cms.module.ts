import { Module } from "@nestjs/common";

import { DatabaseModule } from "../database/database.module";
import { CMSPageController } from "./cms.controller";
import { CMSPageService } from "./cms.service";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        CMSPageController
    ],
    providers: [
        CMSPageService
    ]
})
export class CMSModule { }
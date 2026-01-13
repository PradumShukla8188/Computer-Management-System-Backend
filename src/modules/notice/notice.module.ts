import { Module } from "@nestjs/common";
import { NoticeController } from "./notice.controller";
import { DatabaseModule } from "../database/database.module";
import { NoticeService } from "./notice.service";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        NoticeController
    ],
    providers: [
        NoticeService
    ]
})
export class NoticeModule { }
import { Module } from "@nestjs/common";
import { ExamController } from "./exam.controller";
import { ExamService } from "./exam.service";
import { DatabaseModule } from "../database/database.module";
import { SharedModule } from "src/services/shared.module";

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [
        ExamController
    ],
    providers: [
        ExamService
    ]
})
export class ExamModule { }
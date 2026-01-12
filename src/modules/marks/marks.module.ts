import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { SharedModule } from "src/services/shared.module";
import { MarksController } from "./marks.controller";
import { MarksService } from "./marks.service";

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [MarksController],
    providers: [MarksService],
    exports: [MarksService]
})
export class MarksModule { }
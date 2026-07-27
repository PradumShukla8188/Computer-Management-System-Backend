import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { DatabaseModule } from "../database/database.module";
import { EventService } from "./event.service";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        EventController
    ],
    providers: [
        EventService
    ]
})
export class EventModule { }

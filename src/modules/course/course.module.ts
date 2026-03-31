import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./course.service";
import { DatabaseModule } from "../database/database.module";
import { SharedModule } from "src/services/shared.module";

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [
        CourseController
    ],
    providers: [
        CourseService
    ]
})
export class CourseModule { }
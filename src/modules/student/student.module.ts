import { Module } from "@nestjs/common";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { DatabaseModule } from "../database/database.module";
import { SharedModule } from "src/services/shared.module";

@Module({
    imports: [DatabaseModule, SharedModule],
    controllers: [
        StudentController
    ],
    providers: [
        StudentService
    ]
})
export class StudentModule { }
import { Module } from "@nestjs/common";
import { PublicStudentDocumentsController, StudentController } from "./student.controller";
import { StudentService } from "./student.service";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [
        DatabaseModule
    ],
    controllers: [
        StudentController,
        PublicStudentDocumentsController
    ],
    providers: [
        StudentService
    ]
})
export class StudentModule { }

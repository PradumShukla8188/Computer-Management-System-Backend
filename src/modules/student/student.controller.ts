import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { StudentService } from "./student.service";
import * as DTO from "./student.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";


@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Students')
@Controller('student')
export class StudentController {

    constructor(
        private studentService: StudentService
    ) { }


    @Get()
    @ApiOperation({ summary: 'Student List' })
    StudentList() {
        return this.studentService.studentsList();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Student Detail' })
    StudentDetail(@Param() plan: DTO.GetStudent) {
        return this.studentService.getStudent(plan);
    }

    @Post('create')
    @ApiOperation({ summary: 'Create Student' })
    createStudent(@Body() createStudent: DTO.CreateStudentDTO) {
        return this.studentService.createStudent(createStudent);
    }

    // @Put()
    // @ApiOperation({ summary: 'Update Student' })
    // UpdatePlan(@Body() updatePlan: DTO.UpdatePlanDTO) {
    //     return this.studentService.updatePlan(updatePlan)
    // }

    // @Put('status')
    // @ApiOperation({ summary: `Update Student's status` })
    // UpdatePlanStatus(@Body() updatePlan: DTO.UpdatePlanStatusDTO) {
    //     return this.studentService.updatePlanStatus(updatePlan)
    // }

    @Delete('delete')
    @ApiOperation({ summary: `Delete Student` })
    DeleteStudent(@Body() deleteStudent: DTO.DeleteStudentDTO) {
        return this.studentService.deleteStudent(deleteStudent)
    }
}
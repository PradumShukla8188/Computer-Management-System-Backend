import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
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
    StudentList(@Query() query: DTO.GetStudentListDTO) {
        return this.studentService.studentsList(query);
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




    @Delete('delete')
    @ApiOperation({ summary: `Delete Student` })
    DeleteStudent(@Body() deleteStudent: DTO.DeleteStudentDTO) {
        return this.studentService.deleteStudent(deleteStudent)
    }



    /**student fees section */
    // ---------------------------------------
    // CREATE FEES
    // ---------------------------------------
    @Post('fees/add')
    @ApiOperation({ summary: 'Add Student Fees' })
    createFees(@Body() dto: DTO.CreateFeesDTO) {
        console.log("body data", dto)
        return this.studentService.createFees(dto);
    }

    // ---------------------------------------
    // UPDATE FEES
    // ---------------------------------------
    @Patch('fees/update')
    @ApiOperation({ summary: 'Update Student Fees' })
    updateFees(@Body() dto: DTO.UpdateFeesDTO) {
        return this.studentService.updateFees(dto);
    }

    // ---------------------------------------
    // DELETE FEES (SOFT DELETE)
    // ---------------------------------------
    @Delete('fees/delete')
    @ApiOperation({ summary: 'Delete Student Fees' })
    deleteFees(@Body() dto: DTO.DeleteFeesDTO) {
        return this.studentService.deleteFees(dto);
    }

    // ---------------------------------------
    // LIST FEES
    // ---------------------------------------
    @Get('fees/list')
    @ApiOperation({ summary: 'List All Student Fees' })
    listFees() {
        return this.studentService.listFees();
    }

    // ---------------------------------------
    // GET FEES DETAIL
    // ---------------------------------------
    @Get('fees/:id')
    @ApiOperation({ summary: 'Get Fee Details by ID' })
    getFees(@Param('id') id: string) {
        return this.studentService.getFees({ _id: id });
    }

    @Post('edit/:id')
    @ApiOperation({ summary: 'Update Student' })
    updateStudent(@Param('id') id: string, @Body() dto: DTO.UpdateStudentDTO) {
        return this.studentService.updateStudent(id, dto);
    }
}
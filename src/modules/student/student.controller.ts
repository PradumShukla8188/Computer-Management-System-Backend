import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/getUser';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import type { getUser } from 'src/interfaces/getUser';
import * as DTO from './student.dto';
import { StudentService } from './student.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Students')
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  @ApiOperation({ summary: 'Student List' })
  StudentList(@GetUser() user: getUser, @Query() query: DTO.GetStudentListDTO) {
    return this.studentService.studentsList(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Student Detail' })
  StudentDetail(@GetUser() user: getUser, @Param() plan: DTO.GetStudent) {
    return this.studentService.getStudent(user, plan);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create Student' })
  createStudent(@GetUser() user: getUser, @Body() createStudent: DTO.CreateStudentDTO) {
    return this.studentService.createStudent(user, createStudent);
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
  DeleteStudent(@GetUser() user: getUser, @Body() deleteStudent: DTO.DeleteStudentDTO) {
    return this.studentService.deleteStudent(user, deleteStudent);
  }

  /**student fees section */
  // ---------------------------------------
  // CREATE FEES
  // ---------------------------------------
  @Post('fees/add')
  @ApiOperation({ summary: 'Add Student Fees' })
  createFees(@GetUser() user: getUser, @Body() dto: DTO.CreateFeesDTO) {
    return this.studentService.createFees(user, dto);
  }

  // ---------------------------------------
  // UPDATE FEES
  // ---------------------------------------
  @Patch('fees/update')
  @ApiOperation({ summary: 'Update Student Fees' })
  updateFees(@GetUser() user: getUser, @Body() dto: DTO.UpdateFeesDTO) {
    return this.studentService.updateFees(user, dto);
  }

  // ---------------------------------------
  // DELETE FEES (SOFT DELETE)
  // ---------------------------------------
  @Delete('fees/delete')
  @ApiOperation({ summary: 'Delete Student Fees' })
  deleteFees(@GetUser() user: getUser, @Body() dto: DTO.DeleteFeesDTO) {
    return this.studentService.deleteFees(user, dto);
  }

  // ---------------------------------------
  // LIST FEES
  // ---------------------------------------
  @Get('fees/list')
  @ApiOperation({ summary: 'List All Student Fees' })
  listFees(@GetUser() user: getUser) {
    return this.studentService.listFees(user);
  }

  // ---------------------------------------
  // GET FEES DETAIL
  // ---------------------------------------
  @Get('fees/:id')
  @ApiOperation({ summary: 'Get Fee Details by ID' })
  getFees(@GetUser() user: getUser, @Param('id') id: string) {
    return this.studentService.getFees({ _id: id });
  }
}

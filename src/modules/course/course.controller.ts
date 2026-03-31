import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/getUser';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import type { getUser } from 'src/interfaces/getUser';
import * as DTO from './course.dto';
import { CourseService } from './course.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('courses')
@Controller('course')
export class CourseController {
  constructor(private CourseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Course List' })
  CourseList(@GetUser() user: getUser, @Query() query: DTO.GetCourseListDTO) {
    return this.CourseService.CoursesList(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Course Detail' })
  CourseDetail(@GetUser() user: getUser, @Param() plan: DTO.GetCourse) {
    return this.CourseService.getCourse(user, plan);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create Course' })
  createCourse(@GetUser() user: getUser, @Body() createCourse: DTO.CreateCourseDTO) {
    console.log('Received CreateCourseDTO:', createCourse);
    return this.CourseService.createCourse(user, createCourse);
  }

  // @Put()
  // @ApiOperation({ summary: 'Update Course' })
  // UpdatePlan(@Body() updatePlan: DTO.UpdatePlanDTO) {
  //     return this.CourseService.updatePlan(updatePlan)
  // }

  // @Put('status')
  // @ApiOperation({ summary: `Update Course's status` })
  // UpdatePlanStatus(@Body() updatePlan: DTO.UpdatePlanStatusDTO) {
  //     return this.CourseService.updatePlanStatus(updatePlan)
  // }

  @Delete('delete')
  @ApiOperation({ summary: `Delete Course` })
  DeleteCourse(@GetUser() user: getUser, @Body() deleteCourse: DTO.DeleteCourseDTO) {
    return this.CourseService.deleteCourse(user, deleteCourse);
  }
}

import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CourseService } from "./course.service";
import * as DTO from "./course.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";


@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('courses')
@Controller('course')
export class CourseController {

    constructor(
        private CourseService: CourseService
    ) { }


    @Get()
    @ApiOperation({ summary: 'Course List' })
    CourseList(@Query() query: DTO.GetCourseListDTO) {
        return this.CourseService.CoursesList(query);
    }


    @Get(':id')
    @ApiOperation({ summary: 'Course Detail' })
    CourseDetail(@Param() plan: DTO.GetCourse) {
        return this.CourseService.getCourse(plan);
    }

    @Post('create')
    @ApiOperation({ summary: 'Create Course' })
    createCourse(@Body() createCourse: DTO.CreateCourseDTO) {
        console.log('Received CreateCourseDTO:', createCourse);
        return this.CourseService.createCourse(createCourse);
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
    DeleteCourse(@Body() deleteCourse: DTO.DeleteCourseDTO) {
        return this.CourseService.deleteCourse(deleteCourse)
    }
}
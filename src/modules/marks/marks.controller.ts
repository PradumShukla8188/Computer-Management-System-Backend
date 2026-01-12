import { Controller, Post, Body, Patch, Param, Get, Query, Delete } from '@nestjs/common';
import { MarksService } from './marks.service';
import { CreateStudentMarkDto, UpdateStudentMarkDto } from './marks.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Marks')
@Controller('marks')
export class MarksController {
    constructor(private readonly marksService: MarksService) { }

    // Admin adds marks
    @Post()
    @ApiOperation({ summary: 'Add student marks' })
    addMarks(@Body() dto: CreateStudentMarkDto) {
        return this.marksService.addMarks(dto);
    }

    // Admin updates marks
    // @Patch(':id')
    // @ApiOperation({ summary: 'Update student marks' })
    // updateMarks(
    //     @Param('id') id: string,
    //     @Body() dto: UpdateStudentMarkDto,
    // ) {
    //     return this.marksService.updateMarks(id, dto);
    // }

    // View student marks
    @Get('student/:studentId')
    @ApiOperation({ summary: 'Get student marks' })
    getStudentMarks(@Param('studentId') studentId: string) {
        return this.marksService.getMarksByStudent(studentId);
    }

    // Filter by exam
    @Get()
    @ApiOperation({ summary: 'Get marks by exam' })
    getMarksByExam(@Query('examName') examName: string) {
        return this.marksService.getMarksByExam(examName);
    }

    // Get all marks
    @Get('list')
    @ApiOperation({ summary: 'Get all marks' })
    getAllMarks() {
        return this.marksService.getAllMarks();
    }

    //delte student marks
    @Delete(':id')
    @ApiOperation({ summary: 'Delete student marks' })
    deleteMarks(@Param('id') id: string) {
        return this.marksService.deleteMarks(id);
    }

    //update student marks
    @Patch(':id')
    @ApiOperation({ summary: 'Update student marks' })
    updatedMarks(
        @Param('id') id: string,
        @Body() dto: UpdateStudentMarkDto,
    ) {
        return this.marksService.updatedMarks(id, dto);
    }
}

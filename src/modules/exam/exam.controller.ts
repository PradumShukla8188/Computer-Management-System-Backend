import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto, GetExamListDto } from './exam.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Exams')
@Controller('exam')
export class ExamController {
    constructor(private readonly examService: ExamService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new exam' })
    createExam(@Body() dto: CreateExamDto) { return this.examService.createExam(dto); }

    @Get(':id')
    @ApiOperation({ summary: 'Get exam details' })
    getExamWithDetails(@Param('id') id: string) { return this.examService.getExamWithDetails(id); }

    @Get()
    @ApiOperation({ summary: 'Get exam list' })
    getAllExamsSummary(@Query() query: GetExamListDto) { return this.examService.getAllExamsSummary(query); }


}

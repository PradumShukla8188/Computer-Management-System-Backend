import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto, CreateQuestionDto, SearchResultDto, StartAttemptDto, SubmitAttemptDto } from './exam.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Exams')
@Controller('exams')
export class ExamController {
    constructor(private readonly examService: ExamService) { }

    @Post('create') 
    @ApiOperation({ summary: 'Create a new exam' })
    createExam(@Body() dto: CreateExamDto) { return this.examService.createExam(dto); }

    @Post('question/add') 
    @ApiOperation({ summary: 'Add a question to an exam' })
    addQuestion(@Body() dto: CreateQuestionDto) { return this.examService.addQuestion(dto); }

    @Post('attempt/start') 
    @ApiOperation({ summary: 'Start an exam attempt' })
    startAttempt(@Body() dto: StartAttemptDto) { return this.examService.startAttempt(dto); }

    @Post('attempt/submit') 
    @ApiOperation({ summary: 'Submit an exam attempt' })
    submitAttempt(@Body() dto: SubmitAttemptDto) { return this.examService.submitAttempt(dto); }

    @Get('attempt/:id') 
    @ApiOperation({ summary: 'Get attempt details' })
    getAttempt(@Param('id') id: string) { return this.examService.getAttempt(id); }

    @Post('result/search') 
    @ApiOperation({ summary: 'Search exam results' })
    searchResult(@Body() dto: SearchResultDto) { return this.examService.searchResult(dto); }

    @Get('certificate/download/:attemptId') 
    @ApiOperation({ summary: 'Download Certificate PDF' })
    downloadCertificate(@Param('attemptId') attemptId: string) { return this.examService.downloadCertificatePdf(attemptId); }
}

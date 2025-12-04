import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto, CreateQuestionDto, SearchResultDto, StartAttemptDto, SubmitAttemptDto } from './exam.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Students')
@Controller('exams')
export class ExamController {
    constructor(private readonly examService: ExamService) { }

    @Post('create') createExam(@Body() dto: CreateExamDto) { return this.examService.createExam(dto); }
    @Post('question/add') addQuestion(@Body() dto: CreateQuestionDto) { return this.examService.addQuestion(dto); }
    @Post('attempt/start') startAttempt(@Body() dto: StartAttemptDto) { return this.examService.startAttempt(dto); }
    @Post('attempt/submit') submitAttempt(@Body() dto: SubmitAttemptDto) { return this.examService.submitAttempt(dto); }
    @Get('attempt/:id') getAttempt(@Param('id') id: string) { return this.examService.getAttempt(id); }
    @Post('result/search') searchResult(@Body() dto: SearchResultDto) { return this.examService.searchResult(dto); }
    @Get('certificate/download/:attemptId') downloadCertificate(@Param('attemptId') attemptId: string) { return this.examService.downloadCertificatePdf(attemptId); }
}

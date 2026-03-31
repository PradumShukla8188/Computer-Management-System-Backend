import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorators/getUser';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import type { getUser } from 'src/interfaces/getUser';
import {
  CreateExamDto,
  CreateQuestionDto,
  SearchResultDto,
  StartAttemptDto,
  SubmitAttemptDto,
} from './exam.dto';
import { ExamService } from './exam.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Exams')
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new exam' })
  createExam(@GetUser() user: getUser, @Body() dto: CreateExamDto) {
    return this.examService.createExam(user, dto);
  }

  @Post('question/add')
  @ApiOperation({ summary: 'Add a question to an exam' })
  addQuestion(@GetUser() user: getUser, @Body() dto: CreateQuestionDto) {
    return this.examService.addQuestion(user, dto);
  }

  @Post('attempt/start')
  @ApiOperation({ summary: 'Start an exam attempt' })
  startAttempt(@GetUser() user: getUser, @Body() dto: StartAttemptDto) {
    return this.examService.startAttempt(user, dto);
  }

  @Post('attempt/submit')
  @ApiOperation({ summary: 'Submit an exam attempt' })
  submitAttempt(@GetUser() user: getUser, @Body() dto: SubmitAttemptDto) {
    return this.examService.submitAttempt(user, dto);
  }

  @Get('attempt/:id')
  @ApiOperation({ summary: 'Get attempt details' })
  getAttempt(@GetUser() user: getUser, @Param('id') id: string) {
    return this.examService.getAttempt(user, id);
  }

  @Post('result/search')
  @ApiOperation({ summary: 'Search exam results' })
  searchResult(@GetUser() user: getUser, @Body() dto: SearchResultDto) {
    return this.examService.searchResult(user, dto);
  }

  @Get('certificate/download/:attemptId')
  @ApiOperation({ summary: 'Download Certificate PDF' })
  downloadCertificate(@GetUser() user: getUser, @Param('attemptId') attemptId: string) {
    return this.examService.downloadCertificatePdf(user, attemptId);
  }
}

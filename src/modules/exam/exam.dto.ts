import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateExamDto {
    @ApiProperty({ example: 'Final Semester Exam', description: 'Title of the exam' })
    title: string;

    @ApiPropertyOptional({ example: 'End of term assessment for all students', description: 'Description of the exam' })
    description?: string;

    @ApiProperty({ example: 'OBJECTIVE', enum: ['OBJECTIVE', 'TYPING'] })
    mode: 'OBJECTIVE' | 'TYPING';

    @ApiProperty({ example: 60, description: 'Duration in minutes' })
    durationMinutes: number;

    @ApiProperty({ example: 100, description: 'Total marks for the exam' })
    totalMarks: number;

    @ApiProperty({ example: 40, description: 'Passing marks' })
    passMarks: number;
}

export class QuestionOption {
    @ApiProperty({ example: 'Option A text' })
    text: string;

    @ApiProperty({ example: false })
    isCorrect: boolean;
}

export class CreateQuestionDto {
    @ApiProperty({ example: '657f1f77bcf86cd799439011', description: 'Exam ID' })
    examId: string;

    @ApiProperty({ example: 'MCQ', enum: ['MCQ', 'TYPING'] })
    questionType: 'MCQ' | 'TYPING';

    @ApiProperty({ example: 'What is the capital of France?' })
    text: string;

    @ApiPropertyOptional({ example: 5 })
    marks?: number;

    @ApiPropertyOptional({ type: [QuestionOption], description: 'Options for MCQ' })
    options?: { text: string; isCorrect: boolean }[];

    @ApiPropertyOptional({ example: { difficulty: 'easy' } })
    meta?: any;
}

export class StartAttemptDto {
    @ApiProperty({ example: '657f1f77bcf86cd799439011' })
    examId: string;

    @ApiProperty({ example: '657f1f77bcf86cd799439022' })
    userId: string;

    @ApiPropertyOptional({ example: 'ROL123' })
    rollNumber?: string;

    @ApiPropertyOptional({ example: 'student@example.com' })
    email?: string;
}

export class AnswerDto {
    @ApiProperty({ example: '657f1f77bcf86cd799439033', description: 'Question ID' })
    questionId: string;

    @ApiPropertyOptional({ example: '657f1f77bcf86cd799439044', description: 'Selected Option ID (for MCQ)' })
    optionId?: string;

    @ApiPropertyOptional({ example: 'Some typed answer', description: 'Typed answer text' })
    typingText?: string;
}

export class SubmitAttemptDto {
    @ApiProperty({ example: '657f1f77bcf86cd799439055', description: 'Attempt ID' })
    attemptId: string;

    @ApiProperty({ type: [AnswerDto] })
    answers: {
        questionId: string;
        optionId?: string;
        typingText?: string;
    }[];
}

export class SearchResultDto {
    @ApiPropertyOptional({ example: '657f1f77bcf86cd799439011' })
    examId?: string;

    @ApiPropertyOptional({ example: 'student@example.com' })
    email?: string;

    @ApiPropertyOptional({ example: 'ROL123' })
    rollNumber?: string;
}

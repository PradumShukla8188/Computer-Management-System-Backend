export class CreateExamDto {
    title: string;
    description?: string;
    mode: 'OBJECTIVE' | 'TYPING';
    durationMinutes: number;
    totalMarks: number;
    passMarks: number;
}

export class CreateQuestionDto {
    examId: string;
    questionType: 'MCQ' | 'TYPING';
    text: string;
    marks?: number;
    options?: { text: string; isCorrect: boolean }[];
    meta?: any;
}

export class StartAttemptDto {
    examId: string;
    userId: string;
    rollNumber?: string;
    email?: string;
}

export class SubmitAttemptDto {
    attemptId: string;
    answers: {
        questionId: string;
        optionId?: string;
        typingText?: string;
    }[];
}

export class SearchResultDto {
    examId?: string;
    email?: string;
    rollNumber?: string;
}

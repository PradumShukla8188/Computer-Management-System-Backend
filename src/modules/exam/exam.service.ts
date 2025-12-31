// exam.service.ts (simplified)
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import * as PDFDocument from 'pdfkit';
import { CreateExamDto, CreateQuestionDto, SearchResultDto, StartAttemptDto, SubmitAttemptDto } from './exam.dto';

@Injectable()
export class ExamService {
    constructor(
        @InjectModel('Exam') private examModel: Model<any>,
        @InjectModel('Question') private questionModel: Model<any>,
        @InjectModel('Option') private optionModel: Model<any>,
        @InjectModel('Attempt') private attemptModel: Model<any>,
        @InjectModel('CertificateTemplate') private certTemplateModel: Model<any>,
    ) { }

    async createExam(dto: CreateExamDto) {
        const exam = await this.examModel.create(dto);
        return { message: 'EXAM_CREATED', data: exam };
    }

    async addQuestion(dto: CreateQuestionDto) {
        const q = await this.questionModel.create({
            examId: dto.examId,
            questionType: dto.questionType,
            text: dto.text,
            marks: dto.marks ?? 1,
            meta: dto.meta,
        });

        if (dto.options && dto.options.length) {
            const ops = dto.options.map(o => ({ ...o, questionId: q._id }));
            await this.optionModel.insertMany(ops);
        }
        return { message: 'QUESTION_ADDED', data: q };
    }

    async startAttempt(dto: StartAttemptDto) {
        const attempt = await this.attemptModel.create({
            examId: dto.examId,
            userId: dto.userId,
            rollNumber: dto.rollNumber,
            email: dto.email,
            startedAt: new Date(),
            answers: [],
        });
        return { message: 'ATTEMPT_STARTED', data: attempt };
    }

    // submit attempt -> evaluate -> store score -> if pass generate certificate & marksheet files
    async submitAttempt(dto: SubmitAttemptDto) {
        const attempt = await this.attemptModel.findById(dto.attemptId);
        if (!attempt) throw new BadRequestException('ATTEMPT_NOT_FOUND');

        const exam = await this.examModel.findById(attempt.examId);
        if (!exam) throw new BadRequestException('EXAM_NOT_FOUND');

        // load questions for this exam
        const questions = await this.questionModel.find({ examId: exam._id });
        const optionsIndex = {};
        if (exam.mode === 'OBJECTIVE') {
            const optionDocs = await this.optionModel.find({ questionId: { $in: questions.map(q => q._id) } });
            // build option map by question
            for (const op of optionDocs) {
                if (!optionsIndex[op.questionId]) optionsIndex[op.questionId] = [];
                optionsIndex[op.questionId].push(op);
            }
        }

        // Evaluate
        let totalScore = 0;
        // const answerRecords = [];

        // =============================
        // FIX: Define correct TS type
        // =============================
        type AnswerRecord = {
            questionId: any;
            optionId?: any;
            typingText?: string;
            subjectiveText?: string;
            typedWords?: number;
            accuracy?: number;
            score: number;
        };

        const answerRecords: AnswerRecord[] = [];

        for (const ans of dto.answers) {
            const q = questions.find(x => x._id.toString() === ans.questionId);
            if (!q) continue;

            let scoreForQ = 0;
            if (q.questionType === 'MCQ') {
                // find selected option
                const selected = await this.optionModel.findById(ans.optionId);
                if (selected && selected.isCorrect) scoreForQ = q.marks;
            } else if (q.questionType === 'TYPING') {
                const testText = q.meta?.text || '';
                const typed = (ans.typingText || '').trim();
                // simple evaluation: word count & accuracy by common words ratio
                const typedWords = typed.split(/\s+/).filter(Boolean).length;
                const sampleWords = testText.split(/\s+/).filter(Boolean);
                // compute Levenshtein-like accuracy: simple token match percent
                let matched = 0;
                const min = Math.min(typedWords, sampleWords.length);
                for (let i = 0; i < min; i++) {
                    if (typed.split(/\s+/)[i] === sampleWords[i]) matched++;
                }
                const accuracy = sampleWords.length ? (matched / sampleWords.length) : 0;
                scoreForQ = Math.round(q.marks * accuracy);
                // store extra metrics
                answerRecords.push({
                    questionId: q._id,
                    typingText: typed,
                    typedWords,
                    accuracy,
                    score: scoreForQ
                });
                totalScore += scoreForQ;
                continue;
            }

            answerRecords.push({
                questionId: q._id,
                optionId: ans.optionId,
                score: scoreForQ
            });

            totalScore += scoreForQ;
        }

        // finalize attempt
        attempt.answers = answerRecords;
        attempt.finishedAt = new Date();
        attempt.totalScore = totalScore;
        attempt.passed = totalScore >= exam.passMarks;
        attempt.evaluatedAt = new Date();
        await attempt.save();

        // if passed -> generate certificate + marksheet
        let certificatePdfPath: string | null = null;

        if (attempt.passed) {
            certificatePdfPath = await this.generateCertificatePdf(attempt, exam);
        }

        // create marksheet PDF always
        const marksheetPdfPath = await this.generateMarksheetPdf(attempt, exam, answerRecords);

        return {
            message: 'ATTEMPT_SUBMITTED',
            data: { attemptId: attempt._id, totalScore, passed: attempt.passed, certificatePdfPath, marksheetPdfPath }
        };
    }

    async getAttempt(id: string) {
        return this.attemptModel.findById(id)
            .populate({ path: 'examId' });
    }

    // search by email OR rollNumber OR examId (returns attempts)
    async searchResult(dto: SearchResultDto) {
        const q: any = { deletedAt: null };
        if (dto.email) q.email = dto.email;
        if (dto.rollNumber) q.rollNumber = dto.rollNumber;
        if (dto.examId) q.examId = dto.examId;
        const results = await this.attemptModel.find(q).populate('examId');
        return { data: results };
    }

    // generate certificate PDF by stamping text on template image
    private async generateCertificatePdf(attempt, exam) {
        // pick a template (first, or by exam meta)
        const template = await this.certTemplateModel.findOne({});
        if (!template) return null;

        const outputImagePath = path.join(__dirname, '..', 'storage', `cert_${attempt._id}.png`);
        // Use sharp to overlay text on the template image.
        // Approach: render text to SVG, composite over template via sharp.
        const svgText = `
      <svg width="1200" height="850">
        <style>
          .name { font-size: ${template.namePos.fontSize}px; fill: #000; font-family: Arial; font-weight:700; }
          .roll { font-size: ${template.rollPos.fontSize}px; fill: #000; font-family: Arial; }
          .date { font-size: ${template.datePos.fontSize}px; fill: #000; font-family: Arial; }
        </style>
        <text x="${template.namePos.x}" y="${template.namePos.y}" class="name">${attempt.userId || 'Student Name'}</text>
        <text x="${template.rollPos.x}" y="${template.rollPos.y}" class="roll">Roll: ${attempt.rollNumber || ''}</text>
        <text x="${template.datePos.x}" y="${template.datePos.y}" class="date">${(new Date()).toLocaleDateString()}</text>
      </svg>
    `;

        const templateBuffer = fs.readFileSync(template.imagePath);
        // composite
        await sharp(templateBuffer)
            .composite([{ input: Buffer.from(svgText), left: 0, top: 0 }])
            .png()
            .toFile(outputImagePath);

        // then create PDF from the final PNG
        const pdfPath = path.join(__dirname, '..', 'storage', `certificate_${attempt._id}.pdf`);
        await this.imageToPdf(outputImagePath, pdfPath);
        return pdfPath;
    }

    private async generateMarksheetPdf(attempt, exam, answers) {
        const pdfPath = path.join(__dirname, '..', 'storage', `marksheet_${attempt._id}.pdf`);
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);

        doc.fontSize(18).text(`Marksheet - ${exam.title}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${attempt.userId || 'Student'}`);
        doc.text(`Roll Number: ${attempt.rollNumber || ''}`);
        doc.text(`Email: ${attempt.email || ''}`);
        doc.text(`Total Score: ${attempt.totalScore}/${exam.totalMarks}`);
        doc.text(`Result: ${attempt.passed ? 'PASS' : 'FAIL'}`);
        doc.moveDown();

        doc.fontSize(14).text('Question Wise Marks:');
        for (const a of answers) {
            const qdoc = await this.questionModel.findById(a.questionId);
            doc.moveDown(0.3);
            doc.fontSize(11).text(`${qdoc.text} => Score: ${a.score}/${qdoc.marks}`);
            if (a.typingText) {
                doc.fontSize(10).text(`Typed: ${a.typingText.substring(0, 200)}...`);
                doc.text(`Accuracy: ${a.accuracy || 0}`);
            }
        }

        doc.end();
        // await new Promise(resolve => stream.on('finish', resolve));
        await new Promise<void>((resolve) => {
            stream.on('finish', () => resolve());
        });
        return pdfPath;
    }

    // helper: convert image to single page pdf
    private async imageToPdf(imagePath: string, pdfPath: string) {
        const doc = new PDFDocument({ size: 'A4', margin: 0 });
        const stream = fs.createWriteStream(pdfPath);
        doc.pipe(stream);
        doc.image(imagePath, { fit: [595, 842], align: 'center', valign: 'center' });
        doc.end();
        await new Promise<void>(resolve => stream.on('finish', resolve));
        return pdfPath;
    }

    // download endpoint can return file stream via controller using res.sendFile or stream
    async downloadCertificatePdf(attemptId: string) {
        const attempt = await this.attemptModel.findById(attemptId);
        if (!attempt) throw new BadRequestException('Attempt not found');
        const pdfPath = path.join(__dirname, '..', 'storage', `certificate_${attempt._id}.pdf`);
        if (!fs.existsSync(pdfPath)) {
            const exam = await this.examModel.findById(attempt.examId);
            if (attempt.passed) {
                await this.generateCertificatePdf(attempt, exam);
            } else {
                throw new BadRequestException('No certificate available');
            }
        }
        return { path: pdfPath };
    }
}

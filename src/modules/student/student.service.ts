import { BadRequestException, Injectable } from "@nestjs/common";
import * as DTO from "./student.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import {
    Exam,
    InstituteSettings,
    IssuedCertificate,
    Student,
    StudentFees,
    StudentMark,
} from "src/models";
import { message } from "src/constants/messages";

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private StudentModel: Model<Student>,
        @InjectModel(StudentFees.name) private StudentFeesModel: Model<StudentFees>,
        @InjectModel(StudentMark.name) private StudentMarkModel: Model<StudentMark>,
        @InjectModel(IssuedCertificate.name) private IssuedCertificateModel: Model<IssuedCertificate>,
        @InjectModel(Exam.name) private ExamModel: Model<Exam>,
        @InjectModel(InstituteSettings.name) private InstituteSettingsModel: Model<InstituteSettings>,
    ) { }



    private async generateUniqueRollNo(): Promise<string> {
        let rollNo: string;
        let exists: boolean;

        do {
            rollNo = Math.floor(10000000 + Math.random() * 90000000).toString();
            exists = (await this.StudentModel.countDocuments({ rollNo })) > 0;
        } while (exists);

        return rollNo;
    }



    /**
     * @description Create a student
     * @param createStudent 
     * @returns 
     */
    async createStudent(createStudentDto: DTO.CreateStudentDTO) {
        try {
            const { email, mobile, courseId } = createStudentDto;

            const existingStudent = await this.StudentModel.findOne({
                $or: [{ email }, { mobile }],
                deletedAt: null
            });

            if (existingStudent) {
                throw new BadRequestException(message('en', 'STUDENT_EXISTS'));
            }

            const rollNo = await this.generateUniqueRollNo();
            const courseIdObjectId = new mongoose.Types.ObjectId(courseId);

            const newStudent = await this.StudentModel.create({
                ...createStudentDto,
                rollNo,
                courseId: courseIdObjectId
            });

            return {
                message: message('en', 'STUDENT_CREATED'),
                data: newStudent
            };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    /**
     * @description Get student detail
     * @param student 
     * @returns 
     */
    async getStudent(student: DTO.GetStudent) {
        try {
            const { id } = student;
            const studentExists = await this.StudentModel.findOne({ _id: id }).populate('courseId');
            if (studentExists) {
                return {
                    success: true,
                    data: studentExists
                }
            } else {
                throw new BadRequestException(message('en', 'STUDENT_NF'));
            }

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description List of students
     * @returns 
     */
    async studentsList(query: { page?: number; limit?: number }) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;
            const skip = (page - 1) * limit;

            const total = await this.StudentModel.countDocuments({ deleteAt: null });

            const list = await this.StudentModel.find(
                { deleteAt: null },
                { updatedAt: 0, __v: 0 }
            ).populate('courseId')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data: list
            };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    /**
     * @description Delete student
     * @param deleteStudent 
     * @returns 
     */
    async deleteStudent(deleteStudent: DTO.DeleteStudentDTO) {
        try {
            await this.StudentModel.updateOne({ _id: deleteStudent._id }, { deleteAt: new Date() });
            return {
                message: message('en', 'DELETE_STUDENT')
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    /**--------------------Student Fees ------------------------------------- */
    /**
 * @description Add Student Fees
 */
    async createFees(dto: DTO.CreateFeesDTO) {
        try {
            const newFees = await this.StudentFeesModel.create({
                amount: dto.amount,
                courseId: new mongoose.Types.ObjectId(dto.courseId),
                userId: new mongoose.Types.ObjectId(dto.userId),
                studentId: new mongoose.Types.ObjectId(dto.studentId),
            });

            return {
                message: "FEES_ADDED",
                data: newFees
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
    /**
     * @description Update Student Fees
     */
    async updateFees(dto: DTO.UpdateFeesDTO) {
        try {
            const fee = await this.StudentFeesModel.findOne({ _id: dto._id });

            if (!fee) {
                throw new BadRequestException("FEES_NOT_FOUND");
            }

            if (dto.amount !== undefined) fee.amount = dto.amount;
            if (dto.courseId !== undefined) fee.courseId = new mongoose.Types.ObjectId(dto.courseId);
            if (dto.userId !== undefined) fee.userId = new mongoose.Types.ObjectId(dto.userId);
            if (dto.studentId !== undefined) fee.studentId = new mongoose.Types.ObjectId(dto.studentId);

            await fee.save();

            return { message: "FEES_UPDATED" };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
 * @description Soft Delete Fees
 */
    async deleteFees(dto: DTO.DeleteFeesDTO) {
        try {
            await this.StudentFeesModel.updateOne(
                { _id: dto._id },
                { deletedAt: new Date() }
            );

            return {
                message: "FEES_DELETED"
            };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
 * @description List all fees (not deleted)
 */
    async listFees() {
        try {
            const list = await this.StudentFeesModel.find(
                { deletedAt: null },
                { __v: 0 }
            )
                .populate('courseId')
                .populate('userId')
                .populate('studentId');

            return { data: list };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
 * @description Get Fees Detail
 */
    async getFees(dto: DTO.GetFeesDTO) {
        try {
            const fee = await this.StudentFeesModel.findOne(
                { _id: dto._id, deletedAt: null }
            )
                .populate('courseId')
                .populate('userId')
                .populate('studentId');

            if (!fee) {
                throw new BadRequestException("FEES_NOT_FOUND");
            }

            return { data: fee };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    /**
     * @description : update student 
     */
    async updateStudent(id: string, dto: DTO.UpdateStudentDTO) {
        const objId = new mongoose.Types.ObjectId(id)
        try {
            const student = await this.StudentModel.findOne({ _id: objId });
            if (!student) {
                throw new BadRequestException("STUDENT_NOT_FOUND");
            }

            if (dto.name !== undefined) student.name = dto.name;
            if (dto.fatherName !== undefined) student.fatherName = dto.fatherName;
            if (dto.motherName !== undefined) student.motherName = dto.motherName;
            if (dto.dob !== undefined) student.dob = dto.dob;
            if (dto.gender !== undefined) student.gender = dto.gender;
            if (dto.mobile !== undefined) student.mobile = dto.mobile;
            if (dto.email !== undefined) student.email = dto.email;
            if (dto.residentialAddress !== undefined) student.residentialAddress = dto.residentialAddress;
            if (dto.state !== undefined) student.state = dto.state;
            if (dto.district !== undefined) student.district = dto.district;
            if (dto.country !== undefined) student.country = dto.country;
            if (dto.pinCode !== undefined) student.pinCode = dto.pinCode;
            if (dto.religion !== undefined) student.religion = dto.religion;
            if (dto.category !== undefined) student.category = dto.category;
            if (dto.dateOfAdmission !== undefined) student.dateOfAdmission = dto.dateOfAdmission;
            if (dto.courseId !== undefined) student.courseId = new mongoose.Types.ObjectId(dto.courseId);
            if (dto.courseDuration !== undefined) student.courseDuration = dto.courseDuration;
            if (dto.session !== undefined) student.session = dto.session;
            if (dto.totalFees !== undefined) student.totalFees = dto.totalFees;
            if (dto.examMode !== undefined) student.examMode = dto.examMode;
            if (dto.studentPhoto !== undefined) student.studentPhoto = dto.studentPhoto;
            if (dto.uploadEducationProof !== undefined) student.uploadEducationProof = dto.uploadEducationProof;
            if (dto.uploadIdentityProof !== undefined) student.uploadIdentityProof = dto.uploadIdentityProof;

            await student.save();
            return {
                message: "STUDENT_UPDATED",
                data: student
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async searchPublicStudentDocuments(query: DTO.SearchPublicStudentDocumentsDto) {
        try {
            const cleaned = query.search.trim();
            const searchType = query.searchType || 'roll';

            const studentFilter: any = { deletedAt: null };
            if (searchType === 'roll') {
                studentFilter.rollNo = { $regex: `^${this.escapeRegex(cleaned)}$`, $options: 'i' };
            } else {
                studentFilter.name = { $regex: this.escapeRegex(cleaned), $options: 'i' };
            }

            const students = await this.StudentModel.find(studentFilter)
                .populate('courseId')
                .sort({ createdAt: -1 })
                .limit(searchType === 'roll' ? 1 : 20)
                .lean();

            if (!students.length) {
                return {
                    success: true,
                    data: [],
                    message: 'No student found',
                };
            }

            const settings = await this.InstituteSettingsModel.findOne({ isActive: true }).lean();
            const data = await Promise.all(
                students.map(async (student: any) => this.buildStudentDocumentPayload(student, settings)),
            );

            return {
                success: true,
                data,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    private async buildStudentDocumentPayload(student: any, settings?: any) {
        const [marks, certificate] = await Promise.all([
            this.StudentMarkModel.find({
                studentId: student._id,
                isPublished: true,
            })
                .populate('subjectId', 'title')
                .populate('courseId', 'name shortName')
                .sort({ createdAt: 1 })
                .lean(),
            this.IssuedCertificateModel.findOne({
                studentId: student._id,
            })
                .populate('templateId')
                .sort({ issuedAt: -1, createdAt: -1 })
                .lean(),
        ]);

        const marksheet = marks.length ? this.buildMarksheetPayload(student, marks) : null;
        const admitExam = await this.findRelevantExam(student?.courseId?._id || student?.courseId);
        const admitCard = this.buildAdmitCardPayload(student, admitExam, settings);

        return {
            student,
            certificate: certificate ? this.attachCertificatePreviewData(certificate, student) : null,
            marksheet,
            admitCard,
            availability: {
                marksheet: !!marksheet,
                certificateEligible: !!marksheet,
                certificateIssued: !!certificate,
                admitCard: !!admitCard,
            },
        };
    }

    private async findRelevantExam(courseId?: string | mongoose.Types.ObjectId) {
        if (!courseId) {
            return null;
        }

        const normalizedCourseId = new mongoose.Types.ObjectId(courseId.toString());
        const now = new Date();

        const upcomingExam = await this.ExamModel.findOne({
            courseId: normalizedCourseId,
            isPublished: true,
            examDate: { $gte: now },
        })
            .sort({ examDate: 1, createdAt: -1 })
            .lean();

        if (upcomingExam) {
            return upcomingExam;
        }

        return this.ExamModel.findOne({
            courseId: normalizedCourseId,
            isPublished: true,
        })
            .sort({ examDate: -1, createdAt: -1 })
            .lean();
    }

    private buildMarksheetPayload(student: any, marks: any[]) {
        const totalObtained = marks.reduce((sum, mark) => sum + (Number(mark.obtainedMarks) || 0), 0);
        const totalMax = marks.reduce((sum, mark) => sum + (Number(mark.totalMarks) || 0), 0);
        const percentageValue = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
        const percentage = percentageValue.toFixed(2);
        const examName = marks[0]?.examName || 'Marksheet';
        const issuedAt = marks[marks.length - 1]?.createdAt || new Date();

        return {
            examName,
            studentId: student._id?.toString?.() || '',
            rollNumber: student?.rollNo || '-',
            name: student?.name || '-',
            fatherName: student?.fatherName || '-',
            dateOfBirth: this.formatDate(student?.dob),
            course: student?.courseId?.name || '-',
            duration: student?.courseDuration || '-',
            issueDate: this.formatDate(issuedAt),
            registrationNumber: student?.rollNo || '-',
            percentage,
            grade: this.calculateGrade(percentageValue),
            result: percentageValue >= 40 ? 'PASSED' : 'FAILED',
            totalObtained,
            totalMax,
            subjects: marks.map((mark) => ({
                name: mark?.subjectId?.title || 'Subject',
                theory: Number(mark?.obtainedMarks) || 0,
                practical: 0,
                total: Number(mark?.obtainedMarks) || 0,
                maxMarks: Number(mark?.totalMarks) || 0,
                grade: mark?.grade || this.calculateGrade(((Number(mark?.obtainedMarks) || 0) / Math.max(Number(mark?.totalMarks) || 1, 1)) * 100),
            })),
        };
    }

    private buildAdmitCardPayload(student: any, exam: any, settings?: any) {
        if (!student) {
            return null;
        }

        const instituteName = settings?.instituteName || 'SST COMPUTER & WELL KNOWLEDGE INSTITUTE';
        const instituteAddress = settings?.instituteAddress || 'Dikunni Dhikunni, Uttar Pradesh 241203';
        const instituteContact = settings?.instituteContact || '9519222486, 7376486686';
        const centerParts = [instituteName, instituteAddress].filter(Boolean);

        return {
            studentId: student?._id?.toString?.() || '',
            rollNumber: student?.rollNo || '-',
            registrationNumber: student?.rollNo || '-',
            name: student?.name || '-',
            fatherName: student?.fatherName || '-',
            motherName: student?.motherName || '-',
            course: student?.courseId?.name || '-',
            courseDuration: student?.courseDuration || '-',
            admissionDate: this.formatDate(student?.dateOfAdmission || student?.createdAt),
            session: student?.session || '-',
            examName: exam?.title || 'Institute Examination',
            examDate: exam?.examDate ? this.formatDate(exam.examDate) : '-',
            examTime: [exam?.startTime, exam?.endTime].filter(Boolean).join(' - ') || '-',
            center: centerParts.join(', ') || instituteName,
            instituteName,
            instituteAddress,
            instituteContact,
            studentPhoto: student?.studentPhoto || '',
        };
    }

    private attachCertificatePreviewData(certificate: any, student: any) {
        const certificateData = certificate?.data || {};
        const issueDate = this.formatDate(certificate?.issuedAt || certificate?.createdAt || new Date());

        return {
            ...certificate,
            data: {
                student_name: student?.name || '',
                student_full_name: student?.name || '',
                name: student?.name || '',
                father_name: student?.fatherName || '',
                mother_name: student?.motherName || '',
                date_of_birth: this.formatDate(student?.dob),
                dob: this.formatDate(student?.dob),
                course_name: student?.courseId?.name || '',
                course: student?.courseId?.name || '',
                duration: student?.courseDuration || '',
                roll_no: student?.rollNo || '',
                roll_number: student?.rollNo || '',
                registration_number: certificateData.registration_number || certificate?.certificateNumber || student?.rollNo || '',
                session: student?.session || '',
                issue_date: issueDate,
                date: issueDate,
                ...certificateData,
            },
            templatePreview: certificate?.templateId
                ? {
                    _id: certificate.templateId?._id,
                    name: certificate.templateId?.name,
                    design: certificate.templateId?.design || [],
                    dimensions: certificate.templateId?.dimensions || { width: 1123, height: 794 },
                    backgroundImage: certificate.templateId?.backgroundImage || '',
                }
                : null,
        };
    }

    private calculateGrade(percentage: number): string {
        if (percentage >= 90) return 'A+';
        if (percentage >= 80) return 'A';
        if (percentage >= 70) return 'B';
        if (percentage >= 60) return 'C';
        return percentage >= 40 ? 'D' : 'Fail';
    }

    private formatDate(value?: Date | string) {
        if (!value) {
            return '-';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '-';
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    private escapeRegex(value: string) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }




}

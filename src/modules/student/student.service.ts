import { BadRequestException, Injectable } from "@nestjs/common";
import * as DTO from "./student.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Student, StudentFees } from "src/models";
import { message } from "src/constants/messages";

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private StudentModel: Model<Student>,
        @InjectModel(StudentFees.name) private StudentFeesModel: Model<StudentFees>,

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
            const { email, mobile, selectedCourse } = createStudentDto;

            const existingStudent = await this.StudentModel.findOne({
                $or: [{ email }, { mobile }],
                deletedAt: null
            });

            if (existingStudent) {
                throw new BadRequestException(message('en', 'STUDENT_EXISTS'));
            }

            const rollNo = await this.generateUniqueRollNo();
            const selectedCourseId = new mongoose.Types.ObjectId(selectedCourse);

            const newStudent = await this.StudentModel.create({
                ...createStudentDto,
                rollNo,
                selectedCourse: selectedCourseId
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
                courseId: dto.courseId,
                userId: dto.userId,
                studentId: dto.studentId,
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





}   
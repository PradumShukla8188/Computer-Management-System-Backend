import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { message } from 'src/constants/messages';
import type { getUser } from 'src/interfaces/getUser';
import { Student, StudentFees } from 'src/models';
import * as DTO from './student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private StudentModel: Model<Student>,
    @InjectModel(StudentFees.name) private StudentFeesModel: Model<StudentFees>,
  ) {}

  /**
   * @description Create a student
   * @param createStudent
   * @returns
   */
  async createStudent(user: getUser, createStudentDto: DTO.CreateStudentDTO) {
    try {
      const { institute } = user;
      const { email, mobile, selectedCourse } = createStudentDto;

      const existingStudent = await this.StudentModel.findOne({
        $or: [{ email }, { mobile }],
        deletedAt: null,
        instituteId: institute._id,
      });

      if (existingStudent) {
        throw new BadRequestException(message('en', 'STUDENT_EXISTS'));
      }

      const selectedCourseId = new mongoose.Types.ObjectId(selectedCourse);

      const newStudent = await this.StudentModel.create({
        ...createStudentDto,
        selectedCourse: selectedCourseId,
        instituteId: institute._id,
      });

      return {
        message: message('en', 'STUDENT_CREATED'),
        data: newStudent,
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
  async getStudent(user: getUser, student: DTO.GetStudent) {
    try {
      const { institute } = user;
      const { id } = student;
      const studentExists = await this.StudentModel.findOne({
        _id: id,
        instituteId: institute._id,
      });
      if (studentExists) {
        return {
          success: true,
          data: studentExists,
        };
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
  async studentsList(user: getUser, query: { page?: number; limit?: number }) {
    try {
      const { institute } = user;
      const page = query.page || 1;
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;

      const total = await this.StudentModel.countDocuments({
        deleteAt: null,
        instituteId: institute._id,
      });

      const list = await this.StudentModel.find(
        { deleteAt: null, instituteId: institute._id },
        { updatedAt: 0, __v: 0 },
      )
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('selectedCourse', 'name');

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: list,
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
  async deleteStudent(user: getUser, deleteStudent: DTO.DeleteStudentDTO) {
    try {
      const { institute } = user;
      const { _id } = deleteStudent;

      const studentExists = await this.StudentModel.findOne({
        _id,
        instituteId: institute._id,
      });
      if (!studentExists) {
        throw new BadRequestException(message('en', 'STUDENT_NF'));
      }
      await this.StudentModel.updateOne({ _id: deleteStudent._id }, { deleteAt: new Date() });
      return {
        message: message('en', 'DELETE_STUDENT'),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**--------------------Student Fees ------------------------------------- */
  /**
   * @description Add Student Fees
   */
  async createFees(user: getUser, dto: DTO.CreateFeesDTO) {
    try {
      const { institute } = user;
      const { studentId, amount, courseId, userId } = dto;

      const studentExists = await this.StudentModel.findOne({
        _id: studentId,
        instituteId: institute._id,
      });
      if (!studentExists) {
        throw new BadRequestException(message('en', 'STUDENT_NF'));
      }
      const newFees = await this.StudentFeesModel.create({
        amount: dto.amount,
        courseId: dto.courseId,
        userId: dto.userId,
        studentId: dto.studentId,
      });

      return {
        message: 'FEES_ADDED',
        data: newFees,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  /**
   * @description Update Student Fees
   */
  async updateFees(user: getUser, dto: DTO.UpdateFeesDTO) {
    try {
      const { institute } = user;
      const { _id } = dto;

      const studentExists = await this.StudentModel.findOne({
        _id,
        instituteId: institute._id,
      });
      if (!studentExists) {
        throw new BadRequestException(message('en', 'STUDENT_NF'));
      }
      const fee = await this.StudentFeesModel.findOne({ _id: dto._id });

      if (!fee) {
        throw new BadRequestException('FEES_NOT_FOUND');
      }

      if (dto.amount !== undefined) fee.amount = dto.amount;
      if (dto.courseId !== undefined) fee.courseId = new mongoose.Types.ObjectId(dto.courseId);
      if (dto.userId !== undefined) fee.userId = new mongoose.Types.ObjectId(dto.userId);
      if (dto.studentId !== undefined) fee.studentId = new mongoose.Types.ObjectId(dto.studentId);

      await fee.save();

      return { message: 'FEES_UPDATED' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description Soft Delete Fees
   */
  async deleteFees(user: getUser, dto: DTO.DeleteFeesDTO) {
    try {
      const { institute } = user;
      const { _id } = dto;

      const studentExists = await this.StudentModel.findOne({
        _id,
        instituteId: institute._id,
      });
      if (!studentExists) {
        throw new BadRequestException(message('en', 'STUDENT_NF'));
      }
      await this.StudentFeesModel.updateOne({ _id: dto._id }, { deletedAt: new Date() });

      return {
        message: 'FEES_DELETED',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description List all fees (not deleted)
   */
  /**
   * @description List all fees (not deleted) for a specific institute
   */
  async listFees(user: getUser) {
    try {
      const { institute } = user;

      const students = await this.StudentModel.find(
        { instituteId: institute._id, deletedAt: null },
        { _id: 1 },
      );

      const studentIds = students.map((student) => student._id);

      const list = await this.StudentFeesModel.find(
        {
          studentId: { $in: studentIds },
          deletedAt: null,
        },
        { __v: 0 },
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
      const fee = await this.StudentFeesModel.findOne({ _id: dto._id, deletedAt: null })
        .populate('courseId')
        .populate('userId')
        .populate('studentId');

      if (!fee) {
        throw new BadRequestException('FEES_NOT_FOUND');
      }

      return { data: fee };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import * as DTO from "./student.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Student } from "src/models";
import { message } from "src/constants/messages";

@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private StudentModel: Model<Student>,
    ) { }

    /**
     * @description Create a student
     * @param createStudent 
     * @returns 
     */
    async createStudent(createStudentDto: DTO.CreateStudentDTO) {
        try {
            const { email, mobile } = createStudentDto;

            const existingStudent = await this.StudentModel.findOne({
                $or: [{ email }, { mobile }],
            });

            if (existingStudent) {
                // return { message: message('en', 'STUDENT_EXISTS') };
                throw new BadRequestException(message('en', 'STUDENT_EXISTS'));
            }

            await this.StudentModel.create(createStudentDto);

            return {
                message: message('en', 'STUDENT_CREATED'),
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
            const studentExists = await this.StudentModel.findOne({ _id: id });
            if (studentExists) {
                return {
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
     * @description List of plans
     * @returns 
     */
    async studentsList() {
        try {
            const list = await this.StudentModel.find({ deleteAt: null }, { updatedAt: 0, __v: 0 });
            return {
                data: list
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Update a plan's info
     * @param updatePlan 
     * @returns 
     */
    // async updatePlan(updatePlan: DTO.UpdatePlanDTO) {
    //     try {
    //         const { name, description, price, _id, validity } = updatePlan;
    //         let plan = await this.StudentModel.findOne({ _id: _id });
    //         if (plan) {
    //             if (name) {
    //                 plan.name = name;
    //             }
    //             if (description) {
    //                 plan.description = description;
    //             }

    //             if (validity) {
    //                 plan.validity = validity;
    //             }
    //             if (price) {
    //                 plan.price = price;
    //             }
    //             await plan.save();
    //             return {
    //                 message: message('en', 'PLAN_UPDATED')
    //             }
    //         }
    //         throw new BadRequestException(message('en', 'PLAN_NF'));
    //     } catch (error) {
    //         console.log(error);

    //         throw new BadRequestException(error.message);
    //     }
    // }

    // /**
    //  * @description Update plans status
    //  * @param uStatus 
    //  * @returns 
    //  */
    // async updatePlanStatus(uStatus: DTO.UpdatePlanStatusDTO) {
    //     try {
    //         const { status, _id } = uStatus;
    //         let plan = await this.StudentModel.findOne({ _id: _id }, { status: 1 });
    //         if (plan) {
    //             plan.status = status;
    //             await plan.save();
    //             return {
    //                 message: message('en', 'PLAN_UPDATED')
    //             }
    //         }
    //         throw new BadRequestException(message('en', 'PLAN_NF'));
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    /**
     * @description Delete plan
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

}   
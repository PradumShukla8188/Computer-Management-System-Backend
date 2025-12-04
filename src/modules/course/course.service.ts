import { BadRequestException, Injectable } from "@nestjs/common";
import * as DTO from "./course.dto";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Course, Topic, Module } from "src/models";
import { message } from "src/constants/messages";

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course.name) private CourseModel: Model<Course>,
        @InjectModel(Module.name) private ModuleModel: Model<Module>,
        @InjectModel(Topic.name) private TopicModel: Model<Topic>,
    ) { }

    /**
     * @description Create a Course
     * @param createCourse 
     * @returns 
     */
    /**
 * @description Create a Course with Modules + Topics
 */
    async createCourse(createCourseDto: DTO.CreateCourseDTO) {
        try {
            // console.log('CreateCourseDTO:', createCourseDto);
            const { name, syllabus } = createCourseDto;


            const existingCourse = await this.CourseModel.findOne({ name });

            if (existingCourse) {
                throw new BadRequestException(message('en', 'Course_EXISTS'));
            }


            const course = await this.CourseModel.create({
                name: createCourseDto.name,
                shortName: createCourseDto.shortName,
                description: createCourseDto.description,
                durationInMonths: createCourseDto.durationInMonths,
                monthlyFees: createCourseDto.monthlyFees,
                // totalFees: Number(createCourseDto.monthlyFees) * Number(createCourseDto.durationInMonths)
                totalFees: Number(createCourseDto.monthlyFees) * Number(createCourseDto.durationInMonths)

            });


            const moduleIds: mongoose.Types.ObjectId[] = [];

            for (const moduleData of syllabus) {

                const newModule = await this.ModuleModel.create({
                    title: moduleData.title,
                    description: moduleData.description,
                    courseId: course._id,
                });

                const topicIds: mongoose.Types.ObjectId[] = [];

                for (const topicData of moduleData.topics) {
                    const newTopic = await this.TopicModel.create({
                        name: topicData.name,
                        description: topicData.description,
                        moduleId: newModule._id,
                    });

                    topicIds.push(newTopic._id);
                }

                newModule.topics = topicIds;
                await newModule.save();

                moduleIds.push(newModule._id);
            }

            course.modules = moduleIds;
            await course.save();



            return {
                message: message('en', 'Course_CREATED'),
                data: {
                    courseId: course._id,
                    modules: moduleIds,
                },
            };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    /**
    * @description Get Course with Modules + Topics
    */
    async getCourse(getCourseDto: DTO.GetCourse) {
        try {
            const { id } = getCourseDto;

            const course = await this.CourseModel.findOne({ _id: id })
                .populate({
                    path: 'modules',
                    populate: {
                        path: 'topics',
                    },
                });

            if (!course) {
                throw new BadRequestException(message('en', 'Course_NF'));
            }

            return { data: course };

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
 * @description List all courses with modules + topics
 */
    async CoursesList(query: { page?: number; limit?: number }) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;

            const skip = (page - 1) * limit;

            const total = await this.CourseModel.countDocuments({ deletedAt: null });

            const list = await this.CourseModel.find(
                { deletedAt: null },
                { updatedAt: 0, __v: 0 }
            )
                .populate({
                    path: 'modules',
                    populate: {
                        path: 'topics',
                    },
                })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

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
  * @description Update Course Details
  */
    async updateCourse(updateCourseDto: DTO.UpdateCourseDTO) {
        try {
            const { _id } = updateCourseDto;

            const course = await this.CourseModel.findOne({ _id });

            if (!course) {
                throw new BadRequestException(message('en', 'Course_NF'));
            }

            // Update only provided fields
            if (updateCourseDto.name) {
                course.name = updateCourseDto.name;
            }

            if (updateCourseDto.shortName) {
                course.shortName = updateCourseDto.shortName;
            }

            if (updateCourseDto.description) {
                course.description = updateCourseDto.description;
            }

            if (updateCourseDto.durationInMonths !== undefined) {
                course.durationInMonths = updateCourseDto.durationInMonths;
            }

            if (updateCourseDto.monthlyFees !== undefined) {
                course.monthlyFees = updateCourseDto.monthlyFees;
            }

            await course.save();

            return {
                message: message('en', 'COURSE_UPDATED'),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


    /**
 * @description Update Course Status
 */
    async updateCourseStatus(updateStatusDto: DTO.UpdateCourseStatusDTO) {
        try {
            const { _id, status } = updateStatusDto;

            const course = await this.CourseModel.findOne({ _id }, { status: 1 });

            if (!course) {
                throw new BadRequestException(message('en', 'Course_NF'));
            }

            course.status = status;
            await course.save();

            return {
                message: message('en', 'COURSE_STATUS_UPDATED'),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
 * @description Soft Delete Course
 */
    async deleteCourse(deleteCourseDto: DTO.DeleteCourseDTO) {
        try {
            await this.CourseModel.updateOne(
                { _id: deleteCourseDto._id },
                { deletedAt: new Date() }
            );

            return {
                message: message('en', 'COURSE_DELETED'),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }


}   
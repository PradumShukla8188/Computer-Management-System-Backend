import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { message } from 'src/constants/messages';
import type { getUser } from 'src/interfaces/getUser';
import { Course, Module, Topic } from 'src/models';
import * as DTO from './course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private CourseModel: Model<Course>,
    @InjectModel(Module.name) private ModuleModel: Model<Module>,
    @InjectModel(Topic.name) private TopicModel: Model<Topic>,
  ) {}

  /**
   * @description Create a Course
   * @param createCourse
   * @returns
   */
  /**
   * @description Create a Course with Modules + Topics
   */
  async createCourse(user: getUser, createCourseDto: DTO.CreateCourseDTO) {
    try {
      const { institute } = user;
      const { name, syllabus } = createCourseDto;

      const existingCourse = await this.CourseModel.findOne({ name, instituteId: institute._id });

      if (existingCourse) {
        throw new BadRequestException(message('en', 'Course_EXISTS'));
      }

      const course = await this.CourseModel.create({
        instituteId: institute._id,
        name: createCourseDto.name,
        shortName: createCourseDto.shortName,
        description: createCourseDto.description,
        durationInMonths: createCourseDto.durationInMonths,
        monthlyFees: createCourseDto.monthlyFees,
        // totalFees: Number(createCourseDto.monthlyFees) * Number(createCourseDto.durationInMonths)
        totalFees: Number(createCourseDto.monthlyFees) * Number(createCourseDto.durationInMonths),
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
  async getCourse(user: getUser, getCourseDto: DTO.GetCourse) {
    try {
      const { institute } = user;
      const { id } = getCourseDto;

      const course = await this.CourseModel.findOne({
        _id: id,
        instituteId: institute._id,
      }).populate({
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
  async CoursesList(user: getUser, query: { page?: number; limit?: number }) {
    try {
      const { institute } = user;
      const page = query.page || 1;
      const limit = query.limit || 10;

      const skip = (page - 1) * limit;

      const total = await this.CourseModel.countDocuments({
        deletedAt: null,
        instituteId: institute._id,
      });

      const list = await this.CourseModel.aggregate([
        {
          $match: {
            deletedAt: null,
            instituteId: institute._id,
          },
        },
        {
          $lookup: {
            from: 'modules',
            as: 'module',
            let: { courseId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$$courseId', '$courseId'],
                  },
                },
              },
              {
                $lookup: {
                  from: 'topics',
                  as: 'topic',
                  let: { moduleId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $eq: ['$$moduleId', '$moduleId'],
                        },
                      },
                    },
                    {
                      $project: {
                        name: 1,
                        description: 1,
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  title: 1,
                  description: 1,
                  topic: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            updatedAt: 0,
            createdAt: 0,
            modules: 0,
          },
        },
        {
          $facet: {
            paginatedResults: [{ $skip: skip }, { $limit: limit }],
            totalCount: [{ $count: 'count' }],
          },
        },
      ]);

      return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        data: list[0].paginatedResults,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description Update Course Details
   */
  async updateCourse(user: getUser, updateCourseDto: DTO.UpdateCourseDTO) {
    try {
      const { institute } = user;
      const { _id } = updateCourseDto;

      const course = await this.CourseModel.findOne({
        _id,
        instituteId: institute._id,
      });

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
  async updateCourseStatus(user: getUser, updateStatusDto: DTO.UpdateCourseStatusDTO) {
    try {
      const { institute } = user;
      const { _id, status } = updateStatusDto;

      const course = await this.CourseModel.findOne(
        { _id, instituteId: institute._id },
        { status: 1 },
      );

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
  async deleteCourse(user: getUser, deleteCourseDto: DTO.DeleteCourseDTO) {
    try {
      const { institute } = user;
      const { _id } = deleteCourseDto;

      const course = await this.CourseModel.findOne({
        _id,
        instituteId: institute._id,
      });

      if (!course) {
        throw new BadRequestException(message('en', 'Course_NF'));
      }

      await this.CourseModel.updateOne({ _id: deleteCourseDto._id }, { deletedAt: new Date() });

      return {
        message: message('en', 'COURSE_DELETED'),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

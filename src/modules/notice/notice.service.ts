// exam.service.ts (simplified)
import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import * as DTO from "./notice.dto";
import { Notice } from 'src/models';






@Injectable()
export class NoticeService {
    constructor(
        @InjectModel(Notice.name) private NoticeModel: Model<Notice>,

    ) { }


    // Create notification (Admin)
    async create(dto: DTO.CreateNoticeDto) {
        try {
            const exists = await this.NoticeModel.findOne({
                title: dto.title,
                description: dto.description,
                isDeleted: false,
            });

            if (exists) {
                throw new BadRequestException(
                    'Notification with same title and description already exists',
                );
            }

            return await this.NoticeModel.create({ ...dto });
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException('Failed to create notification',);
        }
    }

    //  List notifications (Pagination + Search)
    async findAll(query: DTO.ListDTO) {
        try {
            const page = Number(query.page) || 1;
            const limit = Number(query.limit) || 10;
            const skip = (page - 1) * limit;

            const filter: any = {
                isDeleted: false,
                isActive: true,
            };

            if (query.search) {
                filter.$or = [
                    { title: { $regex: query.search, $options: 'i' } },
                    { description: { $regex: query.search, $options: 'i' } },
                ];
            }

            const [data, total] = await Promise.all([
                this.NoticeModel
                    .find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.NoticeModel.countDocuments(filter),
            ]);

            return {
                data: {
                    notices: data,
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                }
            };
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch notifications',
            );
        }
    }


    //  Get notification by ID
    async findById(id: string) {
        try {
            const notification = await this.NoticeModel.findOne({
                _id: id,
                isDeleted: false,
            });

            if (!notification) {
                throw new NotFoundException('Notification not found');
            }

            return notification;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(
                'Failed to fetch notification',
            );
        }
    }

    //  Update notification (Admin)
    async update(id: string, dto: DTO.UpdateNoticeDto) {
        try {
            const notification = await this.NoticeModel.findOneAndUpdate(
                { _id: id, isDeleted: false },
                dto,
                { new: true },
            );

            if (!notification) {
                throw new NotFoundException('Notification not found');
            }

            return notification;
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(
                'Failed to update notification',
            );
        }
    }

    //  Soft delete (Admin)
    async delete(id: string) {
        try {
            const notification = await this.NoticeModel.findOneAndUpdate(
                { _id: id, isDeleted: false },
                { isDeleted: true },
                { new: true },
            );

            if (!notification) {
                throw new NotFoundException('Notification not found');
            }

            return { message: 'Notification deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(
                'Failed to delete notification',
            );
        }
    }



}

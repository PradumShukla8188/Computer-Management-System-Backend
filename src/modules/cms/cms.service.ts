import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CMSPage, CMSPageDocument } from '../../models/cms/cms-page.schema';
import * as DTO from './cms.dto';

@Injectable()
export class CMSPageService {
    constructor(
        @InjectModel(CMSPage.name)
        private readonly cmsModel: Model<CMSPageDocument>,
    ) { }

    async create(dto: DTO.CreateCMSPageDto): Promise<CMSPage> {
        try {
            const exists = await this.cmsModel.findOne({
                $or: [{ name: dto.name }, { slug: dto.slug }],
            });

            if (exists) {
                throw new BadRequestException('CMS page already exists');
            }

            return await this.cmsModel.create(dto);
        } catch (error) {
            throw error instanceof BadRequestException
                ? error
                : new InternalServerErrorException(error.message);
        }
    }

    async findAll(): Promise<CMSPage[]> {
        try {
            return await this.cmsModel.find().sort({ createdAt: -1 });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findById(id: string): Promise<CMSPage> {
        try {
            const page = await this.cmsModel.findById(id);
            if (!page) {
                throw new NotFoundException('CMS page not found');
            }
            return page;
        } catch (error) {
            throw error instanceof NotFoundException
                ? error
                : new BadRequestException('Invalid CMS ID');
        }
    }

    async update(id: string, dto: DTO.UpdateCMSPageDto): Promise<CMSPage | null> {
        try {
            const page = await this.cmsModel.findById(id);
            if (!page) {
                throw new NotFoundException('CMS page not found');
            }

            if (dto.name || dto.slug) {
                const duplicate = await this.cmsModel.findOne({
                    _id: { $ne: id },
                    $or: [{ name: dto.name }, { slug: dto.slug }],
                });

                if (duplicate) {
                    throw new BadRequestException('CMS page already exists');
                }
            }

            return await this.cmsModel.findByIdAndUpdate(id, dto, {
                new: true,
            });
        } catch (error) {
            throw error instanceof NotFoundException ||
                error instanceof BadRequestException
                ? error
                : new InternalServerErrorException(error.message);
        }
    }

    async delete(id: string): Promise<{ message: string }> {
        try {
            const result = await this.cmsModel.findByIdAndDelete(id);
            if (!result) {
                throw new NotFoundException('CMS page not found');
            }
            return { message: 'CMS page deleted successfully' };
        } catch (error) {
            throw error instanceof NotFoundException
                ? error
                : new BadRequestException('Invalid CMS ID');
        }
    }
}

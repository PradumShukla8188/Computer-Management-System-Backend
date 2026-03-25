import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Institute, Subscription, UserInstitute, Role } from "src/models";
import { message } from "src/constants/messages";
import * as DTO from "./institute.dto";

@Injectable()
export class InstituteService {
    constructor(
        @InjectModel(Institute.name) private InstituteModel: Model<Institute>,
        @InjectModel(Subscription.name) private SubscriptionModel: Model<Subscription>,
        @InjectModel(UserInstitute.name) private UserInstituteModel: Model<UserInstitute>,
        @InjectModel(Role.name) private RoleModel: Model<Role>,
    ) {}

    /**
     * @description Create a new Institute
     */
    async createInstitute(createDto: DTO.CreateInstituteDTO) {
        try {
            const existing = await this.InstituteModel.findOne({
                name: createDto.name,
                ownerId: createDto.ownerId,
            });

            if (existing) {
                throw new BadRequestException(message('en', 'INSTITUTE_EXISTS'));
            }

            const institute = await this.InstituteModel.create({
                name: createDto.name,
                ownerId: createDto.ownerId,
                subdomain: createDto.subdomain,
                commissionPercentage: createDto.commissionPercentage ?? 0,
            });

            const adminRole = await this.RoleModel.findOne({ name: 'admin' });
            if (adminRole) {
                await this.UserInstituteModel.create({
                    userId: createDto.ownerId,
                    instituteId: institute._id,
                    roleId: adminRole._id,
                    isDefault: true,
                    isActive: true
                });
            }

            return {
                message: message('en', 'INSTITUTE_CREATED'),
                data: institute,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Get a single Institute by ID
     */
    async getInstitute(getDto: DTO.GetInstituteDTO) {
        try {
            const institute = await this.InstituteModel.findById(getDto.id)
                .populate('ownerId', 'firstName lastName email');

            if (!institute) {
                throw new BadRequestException(message('en', 'INSTITUTE_NF'));
            }

            // Fetch active subscription for this institute
            const subscription = await this.SubscriptionModel.findOne({
                instituteId: institute._id,
                status: 'ACTIVE',
                endDate: { $gte: new Date() },
            }).sort({ endDate: -1 });

            return {
                data: {
                    ...institute.toObject(),
                    subscription: subscription || null,
                },
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description List all Institutes with pagination & search
     */
    async listInstitutes(query: DTO.GetInstituteListDTO) {
        try {
            const page = query.page || 1;
            const limit = query.limit || 10;
            const skip = (page - 1) * limit;

            const filter: any = {};
            if (query.search) {
                filter.name = { $regex: query.search, $options: 'i' };
            }

            const total = await this.InstituteModel.countDocuments(filter);

            const list = await this.InstituteModel.find(filter, { __v: 0 })
                .populate('ownerId', 'firstName lastName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            // Attach subscription status to each institute
            const instituteIds = list.map((inst) => inst._id);
            const now = new Date();
            const activeSubscriptions = await this.SubscriptionModel.find({
                instituteId: { $in: instituteIds },
                status: 'ACTIVE',
                endDate: { $gte: now },
            });

            const subscriptionMap = new Map<string, any>();
            activeSubscriptions.forEach((sub) => {
                subscriptionMap.set(sub.instituteId.toString(), sub);
            });

            const data = list.map((inst) => ({
                ...inst.toObject(),
                subscription: subscriptionMap.get(inst._id.toString()) || null,
            }));

            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Update Institute details
     */
    async updateInstitute(updateDto: DTO.UpdateInstituteDTO) {
        try {
            const institute = await this.InstituteModel.findById(updateDto._id);

            if (!institute) {
                throw new BadRequestException(message('en', 'INSTITUTE_NF'));
            }

            if (updateDto.name !== undefined) institute.name = updateDto.name;
            if (updateDto.subdomain !== undefined) institute.subdomain = updateDto.subdomain;
            if (updateDto.commissionPercentage !== undefined) {
                institute.commissionPercentage = updateDto.commissionPercentage;
            }

            await institute.save();

            return {
                message: message('en', 'INSTITUTE_UPDATED'),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Update Institute active status
     */
    async updateInstituteStatus(statusDto: DTO.UpdateInstituteStatusDTO) {
        try {
            const institute = await this.InstituteModel.findById(statusDto._id);

            if (!institute) {
                throw new BadRequestException(message('en', 'INSTITUTE_NF'));
            }

            institute.isActive = statusDto.isActive;
            await institute.save();

            return {
                message: message('en', 'INSTITUTE_STATUS_UPDATED'),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Delete an Institute (soft delete)
     */
    async deleteInstitute(deleteDto: DTO.DeleteInstituteDTO) {
        try {
            const institute = await this.InstituteModel.findById(deleteDto._id);

            if (!institute) {
                throw new BadRequestException(message('en', 'INSTITUTE_NF'));
            }

            institute.isActive = false;
            await institute.save();

            return {
                message: message('en', 'INSTITUTE_DELETED'),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Check subscription status for an institute
     */
    async checkSubscription(instituteId: string) {
        try {
            const institute = await this.InstituteModel.findById(instituteId);

            if (!institute) {
                throw new BadRequestException(message('en', 'INSTITUTE_NF'));
            }

            const now = new Date();
            const subscription = await this.SubscriptionModel.findOne({
                instituteId,
                status: 'ACTIVE',
                startDate: { $lte: now },
                endDate: { $gte: now },
            }).sort({ endDate: -1 });

            return {
                data: {
                    instituteId,
                    hasActiveSubscription: !!subscription,
                    subscription: subscription || null,
                },
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}

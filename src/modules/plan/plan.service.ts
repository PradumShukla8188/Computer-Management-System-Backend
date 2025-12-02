import { BadRequestException, Injectable } from "@nestjs/common";
import * as DTO from "./plan.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan } from "src/models";
import { message } from "src/constants/messages";

@Injectable()
export class PlanService {
    constructor(
        @InjectModel(Plan.name) private PlanModel: Model<Plan>,
    ) { }

    /**
     * @description Create a plan
     * @param createPlan 
     * @returns 
     */
    async createPlan(createPlan: DTO.CreatePlanDTO) {
        try {
            const { name, price, description, validity } = createPlan;
            await this.PlanModel.create({ name, price, description, validity });
            return {
                message: message('en', 'PLAN_CREATED')
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Get plan detail
     * @param plan 
     * @returns 
     */
    async getPlan(plan: DTO.GetPlan) {
        try {
            const { id } = plan;
            const planExists = await this.PlanModel.findOne({ _id: id });
            if (planExists) {
                return {
                    data: planExists
                }
            } else {
                throw new BadRequestException(message('en', 'PLAN_NF'));
            }

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description List of plans
     * @returns 
     */
    async plansList() {
        try {
            const list = await this.PlanModel.find({ deleteAt: null }, { updatedAt: 0, __v: 0 });
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
    async updatePlan(updatePlan: DTO.UpdatePlanDTO) {
        try {
            const { name, description, price, _id, validity } = updatePlan;
            let plan = await this.PlanModel.findOne({ _id: _id });
            if (plan) {
                if (name) {
                    plan.name = name;
                }
                if (description) {
                    plan.description = description;
                }

                if (validity) {
                    plan.validity = validity;
                }
                if (price) {
                    plan.price = price;
                }
                await plan.save();
                return {
                    message: message('en', 'PLAN_UPDATED')
                }
            }
            throw new BadRequestException(message('en', 'PLAN_NF'));
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Update plans status
     * @param uStatus 
     * @returns 
     */
    async updatePlanStatus(uStatus: DTO.UpdatePlanStatusDTO) {
        try {
            const { status, _id } = uStatus;
            let plan = await this.PlanModel.findOne({ _id: _id }, { status: 1 });
            if (plan) {
                plan.status = status;
                await plan.save();
                return {
                    message: message('en', 'PLAN_UPDATED')
                }
            }
            throw new BadRequestException(message('en', 'PLAN_NF'));
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Delete plan
     * @param deletePlan 
     * @returns 
     */
    async deletePlan(deletePlan: DTO.DeletePlanDTO) {
        try {
            await this.PlanModel.updateOne({ _id: deletePlan._id }, { deleteAt: new Date() });
            return {
                message: message('en', 'DELETE_PLAN')
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}   
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { PlanService } from "./plan.service";
import * as DTO from "./plan.dto";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";


@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Plans')
@Controller('plan')
export class PlanController {

    constructor(
        private planService: PlanService
    ) { }


    @Get()
    @ApiOperation({ summary: 'Plans List' })
    PlanList() {
        return this.planService.plansList();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Plans Detail' })
    PlanDetail(@Param() plan: DTO.GetPlan) {
        return this.planService.getPlan(plan);
    }

    @Post('create')
    @ApiOperation({ summary: 'Create Plan' })
    createPlan(@Body() createPlan: DTO.CreatePlanDTO) {
        return this.planService.createPlan(createPlan);
    }

    @Put()
    @ApiOperation({ summary: 'Update plan' })
    UpdatePlan(@Body() updatePlan: DTO.UpdatePlanDTO) {
        return this.planService.updatePlan(updatePlan)
    }

    @Put('status')
    @ApiOperation({ summary: `Update plan's status` })
    UpdatePlanStatus(@Body() updatePlan: DTO.UpdatePlanStatusDTO) {
        return this.planService.updatePlanStatus(updatePlan)
    }

    @Delete('delete')
    @ApiOperation({ summary: `Delete Plan` })
    DeletePlan(@Body() deletePlan: DTO.DeletePlanDTO) {
        return this.planService.deletePlan(deletePlan)
    }
}
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { DashboardService } from './dashboard.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard summary stats' })
    getStats(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.dashboardService.getStats(startDate, endDate);
    }

    @Get('chart')
    @ApiOperation({ summary: 'Get student & revenue chart data' })
    getChart(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
        return this.dashboardService.getChartData(startDate, endDate);
    }
}

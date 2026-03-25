import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import * as DTO from './institute.dto';
import { InstituteService } from './institute.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('institute')
@Controller('institute')
export class InstituteController {
  constructor(private readonly instituteService: InstituteService) {}

  @Get()
  @ApiOperation({ summary: 'List all Institutes' })
  listInstitutes(@Query() query: DTO.GetInstituteListDTO) {
    return this.instituteService.listInstitutes(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Institute Detail' })
  getInstitute(@Param() param: DTO.GetInstituteDTO) {
    return this.instituteService.getInstitute(param);
  }

  @Post('create')
  @ApiOperation({ summary: 'Create Institute' })
  createInstitute(@Body() createDto: DTO.CreateInstituteDTO) {
    return this.instituteService.createInstitute(createDto);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update Institute' })
  updateInstitute(@Body() updateDto: DTO.UpdateInstituteDTO) {
    return this.instituteService.updateInstitute(updateDto);
  }

  @Put('status')
  @ApiOperation({ summary: 'Update Institute Status' })
  updateInstituteStatus(@Body() statusDto: DTO.UpdateInstituteStatusDTO) {
    return this.instituteService.updateInstituteStatus(statusDto);
  }

  @Delete('delete')
  @ApiOperation({ summary: 'Delete Institute' })
  deleteInstitute(@Body() deleteDto: DTO.DeleteInstituteDTO) {
    return this.instituteService.deleteInstitute(deleteDto);
  }

  @Get('subscription/:id')
  @ApiOperation({ summary: 'Check Institute Subscription Status' })
  checkSubscription(@Param('id') id: string) {
    return this.instituteService.checkSubscription(id);
  }
}

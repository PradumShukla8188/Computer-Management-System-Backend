import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InstituteSettingsService } from './settings.service';
import * as DTO from './settings.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Institute Settings')
@Controller('institute-settings')
export class InstituteSettingsController {
    constructor(private readonly service: InstituteSettingsService) { }

    @Post()
    @ApiOperation({ summary: 'Create institute settings (Admin)' })
    create(@Body() dto: DTO.CreateInstituteSettingsDto) {
        return this.service.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all institute settings (Admin)' })
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get institute settings by ID' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update institute settings' })
    update(
        @Param('id') id: string,
        @Body() dto: DTO.UpdateInstituteSettingsDto,
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete institute settings' })
    delete(@Param('id') id: string) {
        return this.service.delete(id);
    }
}

/**
 * STUDENT PANEL (Public API)
 */
@ApiTags('Student Panel')
@Controller('public/institute-settings')
export class StudentInstituteSettingsController {
    constructor(private readonly service: InstituteSettingsService) { }

    @Get()
    @ApiOperation({ summary: 'Get active institute settings (Student Panel)' })
    getSettings() {
        return this.service.getActiveSettings();
    }
}

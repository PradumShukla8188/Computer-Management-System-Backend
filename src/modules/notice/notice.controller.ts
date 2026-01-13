import { Controller, Post, Body, Get, Param, UseGuards, Query, Put, Delete } from '@nestjs/common';
import { NoticeService } from './notice.service';
import * as DTO from "./notice.dto";
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Notice')
@Controller('notice')
export class NoticeController {
    constructor(private readonly noticeService: NoticeService) { }

    @Post()
    @ApiOperation({ summary: 'Create Notice' })
    async create(@Body() dto: DTO.CreateNoticeDto) {
        return await this.noticeService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get All Notice' })
    async findAll(@Query() query: DTO.ListDTO) {
        return await this.noticeService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Notice By ID' })
    async findById(@Param('id') id: string) {
        return await this.noticeService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Notice By ID' })
    async update(@Param('id') id: string, @Body() dto: DTO.UpdateNoticeDto) {
        return await this.noticeService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Notice By ID' })
    async delete(@Param('id') id: string) {
        return await this.noticeService.delete(id);
    }


}

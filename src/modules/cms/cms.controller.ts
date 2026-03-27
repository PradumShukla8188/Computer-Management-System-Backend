import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { CMSPageService } from './cms.service';
import * as DTO from './cms.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from '../../guards/admin.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('CMS Pages')
@Controller('cms-pages')
export class CMSPageController {
    constructor(private readonly cmsService: CMSPageService) { }

    @Post()
    @ApiCreatedResponse({ description: 'CMS page created successfully' })
    @ApiBadRequestResponse({ description: 'CMS page already exists' })
    create(@Body() dto: DTO.CreateCMSPageDto) {
        return this.cmsService.create(dto);
    }

    @Get()
    @ApiOkResponse({ description: 'CMS pages fetched successfully' })
    findAll() {
        return this.cmsService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ description: 'CMS page fetched successfully' })
    @ApiNotFoundResponse({ description: 'CMS page not found' })
    findById(@Param('id') id: string) {
        return this.cmsService.findById(id);
    }

    @Put(':id')
    @ApiOkResponse({ description: 'CMS page updated successfully' })
    update(
        @Param('id') id: string,
        @Body() dto: DTO.UpdateCMSPageDto,
    ) {
        return this.cmsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'CMS page deleted successfully' })
    delete(@Param('id') id: string) {
        return this.cmsService.delete(id);
    }
}

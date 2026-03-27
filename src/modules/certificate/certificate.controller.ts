import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import {
    CreateCertificateTemplateDto,
    IssueCertificateDto,
    SearchCertificateDto,
    UpdateCertificateTemplateDto,
} from './certificate.dto';
import { CertificateService } from './certificate.service';

@ApiBearerAuth()
@UseGuards(AuthGuard, AdminGuard)
@ApiTags('Certificate (Admin)')
@Controller('certificate')
export class CertificateController {
    constructor(private readonly certificateService: CertificateService) { }

    @Get('template')
    @ApiOperation({ summary: 'Get certificate templates' })
    getTemplates() {
        return this.certificateService.getTemplates();
    }

    @Post('template')
    @ApiOperation({ summary: 'Create certificate template' })
    createTemplate(@Body() dto: CreateCertificateTemplateDto) {
        return this.certificateService.createTemplate(dto);
    }

    @Patch('template/:id')
    @ApiOperation({ summary: 'Update certificate template' })
    updateTemplate(@Param('id') id: string, @Body() dto: UpdateCertificateTemplateDto) {
        return this.certificateService.updateTemplate(id, dto);
    }

    @Delete('template/:id')
    @ApiOperation({ summary: 'Delete certificate template' })
    deleteTemplate(@Param('id') id: string) {
        return this.certificateService.deleteTemplate(id);
    }

    @Post('issue')
    @ApiOperation({ summary: 'Issue a certificate to a student' })
    issueCertificate(@Body() dto: IssueCertificateDto, @Req() req: any) {
        return this.certificateService.issueCertificate(dto, req?.user?._id?.toString());
    }

    @Get('issued')
    @ApiOperation({ summary: 'Get all issued certificates' })
    getIssuedCertificates() {
        return this.certificateService.getIssuedCertificates();
    }

    @Get('eligible-students')
    @ApiOperation({ summary: 'Get students eligible for certificate issuance' })
    getEligibleStudents() {
        return this.certificateService.getEligibleStudents();
    }

    @Get('issued/:id/pdf')
    @ApiOperation({ summary: 'Download issued certificate PDF' })
    async downloadIssuedCertificatePdf(@Param('id') id: string, @Res() res: Response) {
        const { fileName, buffer } = await this.certificateService.buildCertificatePdf(id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', buffer.length.toString());
        res.send(buffer);
    }
}

@ApiTags('Certificate (Public)')
@Controller('public/certificate')
export class PublicCertificateController {
    constructor(private readonly certificateService: CertificateService) { }

    @Get('search')
    @ApiOperation({ summary: 'Search student certificates by roll or name' })
    searchCertificates(@Query() query: SearchCertificateDto) {
        return this.certificateService.searchPublicCertificates(query);
    }

    @Get('download/:id')
    @ApiOperation({ summary: 'Download student certificate PDF' })
    async downloadCertificate(@Param('id') id: string, @Res() res: Response) {
        const { fileName, buffer } = await this.certificateService.buildCertificatePdf(id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', buffer.length.toString());
        res.send(buffer);
    }
}

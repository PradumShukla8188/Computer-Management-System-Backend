import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Inject, Patch, Query } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CreateCertificateTemplateDto, IssueCertificateDto } from './certificate.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Certificates')
@Controller('certificate')
export class CertificateController {
  constructor(@Inject(CertificateService) private readonly certificateService: CertificateService) {}

  @Post('template')
  @ApiOperation({ summary: 'Create a new certificate template' })
  createTemplate(@Body() dto: CreateCertificateTemplateDto) {
    return this.certificateService.createTemplate(dto);
  }

  @Get('template')
  @ApiOperation({ summary: 'Get all certificate templates' })
  getTemplates() {
    return this.certificateService.getTemplates();
  }

  @Get('template/:id')
  @ApiOperation({ summary: 'Get template by id' })
  getTemplate(@Param('id') id: string) {
    return this.certificateService.getTemplateById(id);
  }

  @Put('template/:id')
  @ApiOperation({ summary: 'Update template' })
  updateTemplate(@Param('id') id: string, @Body() dto: Partial<CreateCertificateTemplateDto>) {
    return this.certificateService.updateTemplate(id, dto);
  }

  @Delete('template/:id')
  @ApiOperation({ summary: 'Delete template' })
  deleteTemplate(@Param('id') id: string) {
    return this.certificateService.deleteTemplate(id);
  }

  @Patch('template/:id/default')
  @ApiOperation({ summary: 'Set template as default' })
  setDefaultTemplate(@Param('id') id: string) {
    return this.certificateService.setDefaultTemplate(id);
  }

  @Post('issue')
  @ApiOperation({ summary: 'Issue a certificate to a student' })
  issueCertificate(@Body() dto: IssueCertificateDto) {
    return this.certificateService.issueCertificate(dto);
  }

  @Get('issued')
  @ApiOperation({ summary: 'Get all issued certificates' })
  getIssuedCertificates(@Query('studentId') studentId?: string, @Query('courseId') courseId?: string) {
    return this.certificateService.getIssuedCertificates({ studentId, courseId });
  }

  @Get('issued/:id')
  @ApiOperation({ summary: 'Get issued certificate by id' })
  getIssuedCertificate(@Param('id') id: string) {
    return this.certificateService.getIssuedCertificateById(id);
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { randomUUID } from 'crypto';

import { CertificateTemplate } from '../../models/certificate/certificate-template.schema';
import { IssuedCertificate } from '../../models/certificate/issued-certificate.schema';
import {
  CreateCertificateTemplateDto,
  IssueCertificateDto,
} from './certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(CertificateTemplate.name)
    private templateModel: Model<CertificateTemplate>,

    @InjectModel(IssuedCertificate.name)
    private issuedModel: Model<IssuedCertificate>,
  ) {}

  async createTemplate(dto: CreateCertificateTemplateDto) {
    try {
      if (dto.isDefault) {
        await this.templateModel.updateMany({}, { isDefault: false });
      }
      
      const placeholders = this.extractPlaceholders(dto.design);
      const template = new this.templateModel({
        ...dto,
        placeholders: dto.placeholders || placeholders
      });
      return await template.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private extractPlaceholders(design: any): string[] {
    const placeholders = new Set<string>();
    const elements = Array.isArray(design) ? design : (design.elements || []);
    
    elements.forEach((el: any) => {
      if (el.type === 'text' && el.text) {
        const matches = el.text.match(/\{\{([^}]+)\}\}/g);
        if (matches) {
          matches.forEach((m: string) => placeholders.add(m));
        }
      }
    });
    
    return Array.from(placeholders);
  }

  async getTemplates() {
    try {
      return await this.templateModel
        .find({ isActive: true })
        .sort({ isDefault: -1, createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTemplateById(id: string) {
    try {
      const template = await this.templateModel.findOne({
        _id: id,
        isActive: true,
      });

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      return template;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Invalid template id');
    }
  }

  async updateTemplate(
    id: string,
    dto: Partial<CreateCertificateTemplateDto>,
  ) {
    try {
      if (dto.isDefault) {
        await this.templateModel.updateMany({ _id: { $ne: id } }, { isDefault: false });
      }

      const updates: any = { ...dto };
      if (dto.design) {
        updates.placeholders = dto.placeholders || this.extractPlaceholders(dto.design);
      }

      const template = await this.templateModel.findByIdAndUpdate(
        id,
        updates,
        { new: true },
      );

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      return template;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  async setDefaultTemplate(id: string) {
    try {
      await this.templateModel.updateMany({}, { isDefault: false });
      const template = await this.templateModel.findByIdAndUpdate(
        id,
        { isDefault: true },
        { new: true }
      );

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      return template;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  async deleteTemplate(id: string) {
    try {
      const template = await this.templateModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true },
      );

      if (!template) {
        throw new NotFoundException('Template not found');
      }

      return { message: 'Template deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Invalid template id');
    }
  }

  async issueCertificate(dto: IssueCertificateDto) {
    try {
      // Validate template
      const template = await this.templateModel.findOne({
        _id: dto.templateId,
        isActive: true,
      });

      if (!template) {
        throw new BadRequestException('Invalid or inactive template');
      }

      const certificateNumber =
        dto.certificateNumber ?? `CERT-${randomUUID()}`;

      const existing = await this.issuedModel.findOne({ certificateNumber });
      if (existing) {
        throw new BadRequestException(
          'Certificate number already exists',
        );
      }

      const issued = new this.issuedModel({
        ...dto,
        certificateNumber,
      });

      const saved = await issued.save();
      return saved.populate(['studentId', 'templateId']);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to issue certificate');
    }
  }

  async getIssuedCertificates(query?: { studentId?: string; courseId?: string }) {
    try {
      const filter: any = { isActive: true };
      if (query?.studentId) filter.studentId = query.studentId;
      if (query?.courseId) filter.courseId = query.courseId;

      return await this.issuedModel
        .find(filter)
        .populate(['studentId', 'templateId'])
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getIssuedCertificateById(id: string) {
    try {
      const issued = await this.issuedModel
        .findById(id)
        .populate(['studentId', 'templateId']);

      if (!issued) {
        throw new NotFoundException('Certificate not found');
      }

      return issued;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Invalid certificate id');
    }
  }
}

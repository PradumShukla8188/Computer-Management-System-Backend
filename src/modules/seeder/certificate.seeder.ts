import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CertificateTemplate } from '../../models/certificate/certificate-template.schema';
import { defaultCertificateTemplates } from './certificate-template.data';

@Injectable()
export class CertificateSeederService {
  constructor(
    @InjectModel(CertificateTemplate.name) private templateModel: Model<CertificateTemplate>,
  ) {}

  async init() {
    try {
      // Check if default templates already exist to avoid duplicates
      const count = await this.templateModel.countDocuments({ isDefault: true });
      if (count === 0) {
        await this.templateModel.insertMany(defaultCertificateTemplates);
        console.log('Default certificate templates seeded.');
      }
      return Promise.resolve();
    } catch (error) {
       console.error('Error seeding certificate templates:', error);
      return Promise.reject(error.message);
    }
  }
}

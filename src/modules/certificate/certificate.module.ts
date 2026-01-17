import { Module } from '@nestjs/common';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { CertificateSeederService } from '../seeder/certificate.seeder';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [CertificateController],
  providers: [CertificateService, CertificateSeederService],
  exports: [CertificateService, CertificateSeederService],
})
export class CertificateModule {}

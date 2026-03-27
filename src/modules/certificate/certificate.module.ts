import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CertificateController, PublicCertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';

@Module({
    imports: [DatabaseModule],
    controllers: [CertificateController, PublicCertificateController],
    providers: [CertificateService],
})
export class CertificateModule { }

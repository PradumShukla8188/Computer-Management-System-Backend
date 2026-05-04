import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CertificateTemplate } from "src/models";
import {
    DEFAULT_SST_CERTIFICATE_TEMPLATE,
    DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE,
    ADVANCED_SST_CERTIFICATE_TEMPLATE,
    ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE
} from "../certificate/default-certificate-template";

@Injectable()
export class CertificateTemplateSeeder {
    constructor(
        @InjectModel(CertificateTemplate.name) private certificateTemplateModel: Model<CertificateTemplate>,
    ) { }

    async init() {
        const templates = [
            // DEFAULT_SST_CERTIFICATE_TEMPLATE,
            // DEFAULT_SST_CERTIFICATE_SIGNATURE_TEMPLATE,
            // ADVANCED_SST_CERTIFICATE_TEMPLATE,
            ADVANCED_SST_CERTIFICATE_SIGNATURE_TEMPLATE,
        ];

        console.log(`Seeding ${templates.length} certificate templates...`);

        for (const template of templates) {
            await this.certificateTemplateModel.findOneAndUpdate(
                { name: template.name },
                {
                    $set: {
                        design: template.design,
                        dimensions: template.dimensions,
                        backgroundImage: (template as any).backgroundImage ?? '',
                    },
                    $setOnInsert: { name: template.name, isActive: true },
                },
                { upsert: true, new: true },
            );
        }

        console.log("Certificate templates seeded successfully.");
    }
}

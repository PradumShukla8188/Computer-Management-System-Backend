import { Injectable } from "@nestjs/common";
import { templates } from "./template.data";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EmailTemplate } from "src/models";
@Injectable()
export class TemplateSeederService {
    constructor(
        @InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>,
    ) { }

    async init() {
        try {
            await this.EmailTemplateModel.deleteMany({});
            await this.EmailTemplateModel.insertMany(templates);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error.message);
        }
    }
}
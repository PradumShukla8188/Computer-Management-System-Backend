import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InstituteSettings } from 'src/models';
import * as DTO from './settings.dto';

@Injectable()
export class InstituteSettingsService {
    constructor(
        @InjectModel(InstituteSettings.name)
        private readonly settingsModel: Model<InstituteSettings>,
    ) { }

    async create(dto: DTO.CreateInstituteSettingsDto) {
        return this.settingsModel.create(dto);
    }

    async findAll() {
        return this.settingsModel.findOne({ isActive: true });
    }

    async findOne(id: string) {
        const data = await this.settingsModel.findById(id);
        if (!data) throw new NotFoundException('Settings not found');
        return data;
    }

    async update(id: string, dto: DTO.UpdateInstituteSettingsDto) {
        const updated = await this.settingsModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
        if (!updated) throw new NotFoundException('Settings not found');
        return updated;
    }

    async delete(id: string) {
        const deleted = await this.settingsModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException('Settings not found');
        return { message: 'Institute settings deleted successfully' };
    }

    /** Student panel usage */
    async getActiveSettings() {
        return this.settingsModel.findOne({ isActive: true });
    }
}

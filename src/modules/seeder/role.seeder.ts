import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role } from "src/models";

const Roles = [
    {
        name: 'admin',
        displayName: 'Admin',
    },
    {
        name: 'student',
        displayName: 'Student',
    },
    {
        name: 'staff',
        displayName: 'Staff',
    }
]

@Injectable()
export class RoleSeeder {
    constructor(
        @InjectModel(Role.name) private RoleModel: Model<Role>

    ) { }

    async init() {
        try {
            let rExists = await this.RoleModel.findOne({});
            if (rExists) {
                await this.RoleModel.deleteMany({});
            }
            await this.RoleModel.insertMany(Roles);
            return Promise.resolve("Roles Added");
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
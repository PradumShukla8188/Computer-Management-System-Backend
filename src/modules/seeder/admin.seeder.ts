import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, Role } from "src/models";
import { Role as RoleEnum } from '../../constants/enum';
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdminSeeder {
    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(Role.name) private RoleModel: Model<Role>,
        private config: ConfigService
    ) { }

    async init() {
        try {
            let rExists = await this.RoleModel.findOne({ name: RoleEnum.Admin.name }, { name: 1 });
            let pass = this.config.get('ADMIN_PASSWORD')
            if (rExists) {
                await this.UserModel.create({
                    firstName: "Super",
                    lastName: "admin",
                    email: this.config.get('ADMIN_EMAIL'),
                    password: await bcrypt.hash(pass, 10),
                    roleId: rExists._id
                });
                return Promise.resolve("Admin added")
            }
            return Promise.resolve("Roles Added");
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
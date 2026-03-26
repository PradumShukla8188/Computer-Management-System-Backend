import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Role, User } from 'src/models';
import { Role as RoleEnum } from '../../constants/enum';

@Injectable()
export class AdminSeeder {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(Role.name) private RoleModel: Model<Role>,
    private config: ConfigService,
  ) {}

  async init() {
    try {
      let rExists = await this.RoleModel.findOne({ name: RoleEnum.SuperAdmin.name }, { name: 1 });

      if (!rExists) {
        await this.RoleModel.create({
          name: RoleEnum.SuperAdmin.name,
          displayName: RoleEnum.SuperAdmin.displayName,
          isStatic: true,
        });
      }

      console.log('rExists', rExists);
      let pass = this.config.get('ADMIN_PASSWORD');
      console.log('Admin pass', pass);
      if (rExists) {
        await this.UserModel.create({
          firstName: 'Super',
          lastName: 'admin',
          email: this.config.get('ADMIN_EMAIL'),
          password: await bcrypt.hash(pass, 10),
          roleId: rExists._id,
        });
        return Promise.resolve('Admin added');
      }
      return Promise.resolve('Roles Added');
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

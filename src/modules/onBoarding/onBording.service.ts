import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import {
  Role as RoleEnum,
  UserStatus,
  UserTokenType,
  cachePrefix,
  templatesSlug,
} from 'src/constants/enum';
import {
  EmailTemplate,
  Institute,
  Role,
  RolePermissions,
  User,
  UserInstitute,
  UserToken,
} from 'src/models';
import { CachingService } from 'src/services/caching.service';
import { CommonService } from 'src/services/common.service';
import { SendmailService } from 'src/services/mail.service';
import { message } from '../../constants/messages';
import * as DTO from './onBoarding.dto';

@Injectable()
export class OnBoardingService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(UserToken.name) private UserTokenModel: Model<UserToken>,
    @InjectModel(Role.name) private RoleModel: Model<Role>,

    @InjectModel(EmailTemplate.name)
    private EmailTemplateModel: Model<EmailTemplate>,
    @InjectModel(RolePermissions.name)
    private RolePermissionsModel: Model<RolePermissions>,
    @InjectModel(Institute.name)
    private InstituteModel: Model<Institute>,
    @InjectModel(UserInstitute.name)
    private UserInstituteModel: Model<UserInstitute>,

    private jwtService: JwtService,
    private configService: ConfigService,
    private commonService: CommonService,
    private sendmail: SendmailService,
    private cache: CachingService,
  ) {}

  /**
   * @description Login for all type of users
   * @param loginDto
   * @returns
   */
  async login(loginDto: DTO.LoginDTO) {
    try {
      let { email, password, instituteId } = loginDto;
      email = email.toLowerCase();

      const userExists = await this.UserModel.findOne(
        { email },
        {
          _id: 1,
          email: 1,
          password: 1,
          status: 1,
          firstName: 1,
          lastName: 1,
          profilePic: 1,
          deletedAt: 1,
        },
      );

      if (!userExists) {
        throw new BadRequestException(message('en', 'INVLD_CRED'));
      }

      if (userExists.status === UserStatus.InActive || userExists.deletedAt) {
        throw new BadRequestException(message('en', 'ACC_INACTIVE'));
      }

      // 🔹 Fetch institutes
      const userInstitutes = await this.UserInstituteModel.find({
        userId: userExists._id,
        isActive: true,
      })
        .populate('roleId', '_id name')
        .populate('instituteId', '_id name subdomain');

      // 🔹 Roles mapping
      const rolesData = userInstitutes.map((inst) => ({
        role: (inst.roleId as any)?.name,
        institute: (inst.instituteId as any)?.name,
      }));

      // 🔹 Admin role check
      const hasAdminRole = userInstitutes.some(
        (inst) =>
          (inst.roleId as any).name === RoleEnum.Admin.name ||
          (inst.roleId as any).name === RoleEnum.SuperAdmin.name,
      );

      if (!hasAdminRole) {
        throw new BadRequestException(message('en', 'INVLD_CRED'));
      }

      // 🔹 Password check
      const isPassSame = await bcrypt.compare(password, userExists.password);

      if (!isPassSame) {
        throw new BadRequestException(message('en', 'INVLD_CRED'));
      }

      // 🔹 Filter admin institutes
      const adminInstitutes = userInstitutes.filter(
        (inst) =>
          !!(inst as any)?.instituteId?._id &&
          ((inst.roleId as any).name === RoleEnum.Admin.name ||
            (inst.roleId as any).name === RoleEnum.SuperAdmin.name),
      );

      if (!adminInstitutes.length) {
        throw new BadRequestException(message('en', 'INVLD_CRED'));
      }

      // 🔹 Single institute flow
      if (adminInstitutes.length === 1) {
        const selectedInstitute = adminInstitutes[0] as any;

        return {
          success: true,
          token: this.jwtService.sign(
            {
              _id: userExists._id,
              instituteId: selectedInstitute.instituteId._id,
              roleId: selectedInstitute.roleId?._id,
            },
            { secret: this.configService.get('SECRET') },
          ),
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          profilePic: userExists.profilePic,
          institutes: adminInstitutes,
          selectedInstitute: selectedInstitute.instituteId,
          email: userExists.email,
        };
      }

      // 🔹 Multi-institute flow
      const preAuthToken = this.jwtService.sign(
        {
          _id: userExists._id,
          preAuth: true,
          panel: 'admin',
        },
        {
          secret: this.configService.get('SECRET'),
          expiresIn: '10m',
        } as any,
      );

      return {
        success: true,
        requiresInstituteSelection: true,
        preAuthToken,
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        profilePic: userExists.profilePic,
        institutes: adminInstitutes,
        email: userExists.email,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description select institute in which want to login
   */
  async adminSelectInstitute(input: DTO.AdminSelectInstituteDTO) {
    try {
      const payload = await this.jwtService.verifyAsync(input.preAuthToken, {
        secret: this.configService.get('SECRET'),
      });

      if (!payload || payload.preAuth !== true || payload.panel !== 'admin' || !payload._id) {
        throw new BadRequestException('Invalid preAuth token');
      }

      const userExists = await this.UserModel.findOne(
        { _id: payload._id },
        {
          _id: 1,
          email: 1,
          status: 1,
          firstName: 1,
          lastName: 1,
          profilePic: 1,
        },
      );

      if (!userExists) throw new BadRequestException(message('en', 'INVLD_CRED'));
      if (userExists.status === UserStatus.InActive || (userExists as any).deletedAt)
        throw new BadRequestException(message('en', 'ACC_INACTIVE'));

      const selectedInstitute = await this.UserInstituteModel.findOne({
        userId: userExists._id,
        instituteId: input.instituteId,
        isActive: true,
      })
        .populate('roleId', '_id name')
        .populate('instituteId', '_id name subdomain');

      if (!selectedInstitute) {
        throw new BadRequestException('Invalid institute selection');
      }

      return {
        success: true,
        token: this.jwtService.sign(
          {
            _id: userExists._id,
            instituteId: (selectedInstitute as any).instituteId._id,
            roleId: (selectedInstitute as any).roleId?._id,
          },
          { secret: this.configService.get('SECRET') },
        ),
        firstName: userExists.firstName,
        lastName: userExists.lastName,
        profilePic: userExists.profilePic,
        selectedInstitute: selectedInstitute,
        email: userExists.email,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description Login for User panel
   */
  async loginUser(loginDto: DTO.LoginDTO) {
    try {
      let { email, password } = loginDto;
      email = email.toLowerCase();

      // find user (with role)
      const userExists = await this.UserModel.findOne(
        { email: email },
        {
          _id: 1,
          email: 1,
          password: 1,
          status: 1,
          firstName: 1,
          lastName: 1,
          profilePic: 1,
          roleId: 1,
        },
      ).populate({ path: 'roleId', select: '_id displayName' });

      if (
        userExists?.roleId?.displayName === RoleEnum.SuperAdmin.displayName ||
        userExists?.roleId?.displayName === RoleEnum.Admin.displayName
      )
        throw new BadRequestException(message('en', 'INVLD_CRED'));

      //if user exists
      if (userExists) {
        if (userExists.status === UserStatus.InActive || userExists.deletedAt)
          throw new BadRequestException(message('en', 'ACC_INACTIVE'));

        const userInstitute = await this.UserInstituteModel.findOne({
          userId: userExists._id,
          roleId: userExists?.roleId,
          isActive: true,
        })
          .populate('roleId', '_id name')
          .populate('instituteId', '_id name subdomain');

        if (!userInstitute) throw new BadRequestException(message('en', 'INVLD_CRED'));
        const isPassSame = await bcrypt.compare(password, userExists.password);

        if (!isPassSame) throw new BadRequestException(message('en', 'INVLD_CRED'));

        let p = await this.RolePermissionsModel.aggregate([
          { $match: { roleId: userExists?.roleId } },
          {
            $lookup: {
              from: 'permissions',
              localField: 'permissionId',
              foreignField: '_id',
              as: 'permissions',
            },
          },
          {
            $unwind: '$permissions',
          },
          {
            $project: {
              pId: '$permissionId',
              name: '$permissions.name',
              displayValue: '$permissions.displayName',
              order: '$permissions.order',
            },
          },
          {
            $sort: { order: 1 },
          },
        ]);

        p = p.map((e) => e.name);
        // p = p.filter((e) => e !== 'list-roles')
        try {
          await this.cache.set(`${cachePrefix}${userExists._id}`, JSON.stringify(p));
        } catch (error) {
          console.log('Error while caching permissions', error);
        }

        return {
          token: this.jwtService.sign(
            {
              _id: userExists._id,
              instituteId: (userInstitute as any).instituteId._id,
              roleId: (userInstitute as any).roleId?._id,
            },
            { secret: this.configService.get('SECRET') },
          ),
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          profilePic: userExists.profilePic,
          userInstitute: userInstitute,
          email: userExists.email,
          permissions: p,
        };
      }

      //if doesn't exist
      throw new BadRequestException(message('en', 'INVLD_CRED'));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description Request for resetting password
   * @param forgotPassword
   */
  async forgotPassword(forgotPassword: DTO.ForgotPasswordDTO) {
    try {
      const { email } = forgotPassword;
      const userExists = await this.UserModel.findOne(
        { email: email.toLowerCase() },
        { firstName: 1, lastName: 1, email: 1 },
      );
      if (userExists) {
        await this.UserTokenModel.deleteMany({
          userId: userExists._id,
          type: UserTokenType.FORGOT_PASSWORD,
        });

        const token = this.commonService.randomString(12);
        await this.UserTokenModel.create({
          token: token,
          userId: userExists._id,
          type: UserTokenType.FORGOT_PASSWORD,
        });

        let template = await this.EmailTemplateModel.findOne({
          uid: templatesSlug.ResetPassword,
        });

        if (template) {
          let URL = `${this.configService.get('FRONTEND_URL')}reset-password/${token}`;

          const userInstitutes = await this.UserInstituteModel.find({
            userId: userExists._id,
            isActive: true,
          }).populate('roleId', '_id name');

          const hasAdminRole = userInstitutes.some(
            (inst) => (inst.roleId as any).name === RoleEnum.Admin.name,
          );
          if (!hasAdminRole) {
            URL = `${this.configService.get('COMPANY_URL')}reset-password/${token}`;
          }
          const variables = {
            '{{subject}}': template.subject,
            '{{logo}}': this.configService.get('LOGO_URL'),
            '{{project}}': this.configService.get('PROJECT'),
            '{{name}}': `${userExists.firstName}`,
            '{{token}}': URL,
            '{{YEAR}}': `${new Date().getFullYear()}`,
          };
          // send mail
          await this.sendmail.sendMail({
            to: [userExists.email],
            subject: template.subject,
            html: this.commonService.replaceVariablesInTemplate(template.html, variables),
          });

          return {
            message: message('en', 'FORGOT_PASS_SUCC'),
          };
        } else {
          throw new BadRequestException(message('en', 'USER_NF'));
        }
      }

      throw new BadRequestException(message('en', 'USER_NF'));
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description verify reset token
   * @param tokenIL
   * @returns
   */
  async verifyResetToken(tokenI: DTO.VerifyResetTokenDTO) {
    try {
      const token = await this.UserTokenModel.findOne({
        token: tokenI.token,
        type: UserTokenType.FORGOT_PASSWORD,
      });
      if (token) {
        let currentDate = new Date();
        const createdAt = token.createdAt ?? new Date(0);
        const diff = Math.abs(
          Math.round((currentDate.getTime() - createdAt.getTime()) / 1000 / 60),
        );

        // const diff = Math.abs(Math.round((currentDate.getTime() - token?.createdAt.getTime()||50000) / 1000 / 60)); //minutes
        if (diff >= 30) {
          await token.deleteOne();
          throw new BadRequestException(message('en', 'TOKEN_EXPIRED'));
        } else {
          return {
            message: '',
          };
        }
      } else {
        throw new BadRequestException(message('en', 'TOKEN_EXPIRED'));
      }
    } catch (error) {
      console.log(error);

      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description reset user password
   * @param Input
   * @returns
   */
  async resetPassword(Input: DTO.ResetPassDTO) {
    try {
      const token = await this.UserTokenModel.findOne({
        token: Input.token,
        type: UserTokenType.FORGOT_PASSWORD,
      });
      if (token) {
        if (Input.password !== Input.confirmPassword) {
          throw new BadRequestException(message('en', 'PASS_CONF_P_MISMATCH'));
        } else {
          let currentDate = new Date();
          const createdAt = token.createdAt ?? new Date(0);
          const diff = Math.abs(
            Math.round((currentDate.getTime() - createdAt.getTime()) / 1000 / 60),
          );

          // const diff = Math.abs(Math.round((currentDate.getTime() - token.createdAt.getTime()) / 1000 / 60)); //minutes
          if (diff >= 30) {
            await token.deleteOne();
            throw new BadRequestException(message('en', 'TOKEN_EXPIRED'));
          } else {
            const newPass = await bcrypt.hash(Input.password, 10);
            // await this.UserModel.updateOne({ password: newPass }, { id: token.userId });
            await this.UserModel.updateOne({ _id: token.userId }, { password: newPass });

            await token.deleteOne();
            return {
              message: message('en', 'RESET_PASS_SUCCESS'),
            };
          }
        }
      } else {
        throw new BadRequestException(message('en', 'TOKEN_EXPIRED'));
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * @description Link superAdmin to all existing institutes
   */
  async linkUserToAllInstitutes() {
    try {
      let superAdminRole = await this.RoleModel.findOne({ name: RoleEnum.SuperAdmin.name }, '_id');
      if (!superAdminRole) {
        superAdminRole = await this.RoleModel.create({
          name: RoleEnum.SuperAdmin.name,
          displayName: 'Super Admin',
          isStatic: true,
        });
      }

      const superadmin = await this.UserModel.findOne({ roleId: superAdminRole._id });
      if (!superadmin) {
        throw new BadRequestException(message('en', 'SUPERADMIN_NF'));
      }

      const allInstitutes = await this.InstituteModel.find({}, { _id: 1 });

      const userInstitutePayloads = allInstitutes.map((inst) => ({
        userId: superadmin._id,
        instituteId: inst._id,
        roleId: superAdminRole._id,
        isActive: true,
        isDefault: false,
      }));

      for (const payload of userInstitutePayloads) {
        await this.UserInstituteModel.updateOne(
          { userId: payload.userId, instituteId: payload.instituteId },
          { $set: payload },
          { upsert: true },
        );
      }

      return {
        message: 'Super Admin successfully linked to all institutes.',
      };
    } catch (error) {
      console.log('eorrr----', error);
      throw new BadRequestException(error.message);
    }
  }
}

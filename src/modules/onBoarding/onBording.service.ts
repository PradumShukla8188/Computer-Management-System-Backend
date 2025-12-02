import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import * as DTO from './onBoarding.dto';
import { User, UserToken, EmailTemplate, RolePermissions } from 'src/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { message } from '../../constants/messages';
import * as bcrypt from 'bcrypt';
import { Role, UserStatus, UserTokenType, cachePrefix, templatesSlug } from 'src/constants/enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CommonService } from 'src/services/common.service';
import { SendmailService } from 'src/services/mail.service';
import { CachingService } from 'src/services/caching.service';

@Injectable()
export class OnBoardingService {
	constructor(
		@InjectModel(User.name) private UserModel: Model<User>,
		@InjectModel(UserToken.name) private UserTokenModel: Model<UserToken>,
		@InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>,
		@InjectModel(RolePermissions.name) private RolePermissionsModel: Model<RolePermissions>,

		private jwtService: JwtService,
		private configService: ConfigService,
		private commonService: CommonService,
		private sendmail: SendmailService,
		private cache: CachingService,
	) { }

	/**
	 * @description Login for all type of users
	 * @param loginDto
	 * @returns
	 */
	async login(loginDto: DTO.LoginDTO) {
		try {
			let { email, password } = loginDto;
			email = email.toLowerCase();

			//find user (with role)
			const userExists = await this.UserModel.findOne(
				{ email: email },
				{
					email: 1,
					password: 1,
					status: 1,
					firstName: 1,
					lastName: 1,
					profilePic: 1,
				},
			).populate({ path: 'roleId', select: '_id name' });

			//if user exists
			if (userExists) {
				if (userExists.status === UserStatus.InActive || userExists.deletedAt)
					throw new BadRequestException(message('en', 'ACC_INACTIVE'));
				if (userExists.roleId.name !== Role.Admin.name)
					throw new BadRequestException(message('en', 'INVLD_CRED'));
				const isPassSame = await bcrypt.compare(password, userExists.password);

				if (!isPassSame) throw new BadRequestException(message('en', 'INVLD_CRED'));

				//send response
				return {
					token: this.jwtService.sign({ _id: userExists._id }, { secret: this.configService.get('SECRET') }),
					firstName: userExists.firstName,
					lastName: userExists.lastName,
					profilePic: userExists.profilePic,
					role: userExists.roleId.name,
					email: userExists.email,
				};
			}

			//if doesn't exist
			throw new BadRequestException(message('en', 'INVLD_CRED'));
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	/**
	 * @description Login for User panel
	 * @param loginDto
	 * @returns
	 */
	async loginUser(loginDto: DTO.LoginDTO) {
		try {
			let { email, password } = loginDto;
			email = email.toLowerCase();

			// find user (with role)
			const userExists = await this.UserModel.findOne(
				{ email: email },
				{
					email: 1,
					password: 1,
					status: 1,
					firstName: 1,
					lastName: 1,
					profilePic: 1,
				},
			)
				.populate({ path: 'roleId', select: '_id name' })
				.populate({ path: 'superiorId', select: 'firstName lastName' });

			//if user exists
			if (userExists) {
				if (userExists.status === UserStatus.InActive || userExists.deletedAt)
					throw new BadRequestException(message('en', 'ACC_INACTIVE'));
				if (userExists.roleId.name == Role.Admin.name)
					throw new BadRequestException(message('en', 'INVLD_CRED'));
				const isPassSame = await bcrypt.compare(password, userExists.password);

				if (!isPassSame) throw new BadRequestException(message('en', 'INVLD_CRED'));

				let p = await this.RolePermissionsModel.aggregate([
					{ $match: { roleId: (userExists.roleId as any)._id } },
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

				p = p.map(e => e.name);
				// p = p.filter((e) => e !== 'list-roles')
				try {
					await this.cache.set(`${cachePrefix}${userExists._id}`, JSON.stringify(p));
				} catch (error) {
					console.log('Error while caching permissions', error);
				}

				//send response
				return {
					token: this.jwtService.sign({ _id: userExists._id }, { secret: this.configService.get('SECRET') }),
					firstName: userExists.firstName,
					lastName: userExists.lastName,
					profilePic: userExists.profilePic,
					role: userExists.roleId.name,
					email: userExists.email,
					permissions: p,
					companyName: userExists.superiorId
						? `${userExists.superiorId.firstName} ${userExists.superiorId.lastName}`
						: userExists.firstName + ' ' + userExists.lastName,
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
				{ firstName: 1, lastName: 1, email: 1, roleId: 1 },
			).populate('roleId', 'name');
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

				let template = await this.EmailTemplateModel.findOne({ uid: templatesSlug.ResetPassword });

				if (template) {
					let URL = `${this.configService.get('FRONTEND_URL')}reset-password/${token}`;
					if (userExists.roleId.name !== Role.Admin.name) {
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
				const diff = Math.abs(Math.round((currentDate.getTime() - createdAt.getTime()) / 1000 / 60));

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
					const diff = Math.abs(Math.round((currentDate.getTime() - createdAt.getTime()) / 1000 / 60));

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
}

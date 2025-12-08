import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, Types } from "mongoose";
import { City, Country, EmailTemplate, State, Timezone, User, UserDetail } from "src/models";
import * as DTO from "./user.dto";
import { JWTUser } from "src/constants/interfaces";
import * as bcrypt from 'bcrypt';
import { message } from "src/constants/messages";
import { Role, templatesSlug } from "src/constants/enum";
import { CommonService } from "src/services/common.service";
import { ConfigService } from "@nestjs/config";
import { SendmailService } from "src/services/mail.service";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private UserModel: Model<User>,
        // @InjectModel(UserTag.name) private UserTagModel: Model<UserTag>,
        @InjectModel(UserDetail.name) private UserDetailModel: Model<UserDetail>,
        @InjectModel(Country.name) private CountryModel: Model<Country>,
        @InjectModel(State.name) private StateModel: Model<State>,
        @InjectModel(City.name) private CityModel: Model<City>,
        @InjectModel(Timezone.name) private TimezoneModel: Model<Timezone>,
        // @InjectModel(Classes.name) private ClassesModel: Model<Classes>,
        @InjectModel(EmailTemplate.name) private EmailTemplateModel: Model<EmailTemplate>,
        // @InjectModel(Tree.name) private TreeModel: Model<Tree>,

        private configService: ConfigService,
        private commonService: CommonService,
        private sendmail: SendmailService
    ) { }

    /**
     * @description Change password
     * @param cPassword 
     * @param user 
     * @returns 
     */
    async changePassward(cPassword: DTO.ChangePassward, user: JWTUser) {
        try {
            const isPasswordSame = bcrypt.compareSync(cPassword.oldPassword, user.password);
            if (isPasswordSame) {
                await this.UserModel.updateOne({ _id: user._id }, { password: bcrypt.hashSync(cPassword.newPassword, 10) });
                return {
                    message: message('en', 'PASS_CHANGED')
                }
            }
            throw new BadRequestException(message('en', 'OLD_PASS_NM'));
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Update profile for admin
     * @param uProfile 
     * @param user 
     * @returns 
     */
    async updateProfileA(uProfile: DTO.UpdateProfileA, user: JWTUser) {
        try {
            await this.UserModel.updateOne({ _id: user._id }, { profilePic: uProfile.profilePic, firstName: uProfile.firstName, lastName: uProfile.lastName });
            return {
                message: message('en', 'PROFILE_UPDATED')
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Dashboard stats for admin
     * @returns 
     */
    async adminDashboard() {
        try {
            return {
                data: {
                    companies: 0,
                    vehicles: 0,
                    maintaince: 0
                }
            }
        } catch (error) {
            throw new BadRequestException(error.message);

        }
    }

    /**
     * @description List of states
     * @param input 
     * @returns 
     */
    async statesList(input: DTO.StatesList) {
        try {
            let countryName = input.countryName || "USA";
            let country = await this.CountryModel.findOne({ iso3: countryName }, { iso3: 1, id: 1 });
            if (country) {
                let states = await this.StateModel.find({ countryId: country.id }, { name: 1, id: 1 })
                return {
                    data: states
                }
            }
            return { data: [] }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description List of country timezones
     * @param input 
     * @returns 
     */
    async timezoneList() {
        try {
            // let countryName = input.countryName || "USA";
            // let country = await this.CountryModel.findOne({ iso3: countryName }, { iso3: 1, id: 1 });
            // if (country) {
            const timezones = await this.TimezoneModel.find({}, { zoneName: 1, abbreviation: 1 });
            return {
                data: timezones
            }
            // }
            // return { data: [] }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Cities List
     * @param input 
     * @returns 
     */
    async cityList(input: DTO.CityList) {
        try {
            const cities = await this.CityModel.find({ statemId: new Types.ObjectId(input.stateId) }, { name: 1 });
            return {
                data: cities
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Add company user
     * @param input 
     * @param user 
     * @returns 
     */
    async addUser(input: DTO.AddUser, user: JWTUser) {
        try {
            // const companyId = user.roleId.name === Role.Company.name ? user._id : user.superiorId;
            const userExists = await this.UserModel.findOne({ email: input.email.toLowerCase() });
            if (userExists) {
                throw new BadRequestException(message('en', 'USER_EMAIL_EXISTS'));
            }

            // if (input?.classId) {
            //     // const classExists = await this.ClassesModel.findOne({ _id: input.classId, companyId }, { name: 1 });
            //     if (!classExists) {
            //         throw new BadRequestException(message('en', 'CLASS_NF'));
            //     }
            // }

            // if (input?.regionId) {
            //     const regionExists = await this.TreeModel.findOne({ _id: input.regionId, companyId }, { name: 1 });
            //     if (!regionExists) {
            //         throw new BadRequestException(message('en', 'REGION_NF'));
            //     }
            // }

            // const timezoneExists = await this.TimezoneModel.findOne({ _id: input.timezoneId }, { zoneName: 1 });
            // if (!timezoneExists) {
            //     throw new BadRequestException(message('en', 'TIMEZONE_NF'));
            // }
            // let p = this.commonService.randomString(8);

            const createdUser = await this.UserModel.create({
                firstName: input.firstName,
                lastName: input.lastName,
                email: input.email.toLowerCase(),
                workPhone: input.workPhone,
                mobilePhone: input.mobilePhone,
                status: input.status,
                roleId: input.roleId,
                classId: input.classId,
                regionId: input.regionId,
                // superiorId: companyId,
                password: bcrypt.hashSync(input?.password, 10)
            });

            await this.UserDetailModel.create({
                userId: createdUser._id,
                // timezoneId: input.timezoneId
            });

            if (input.tags && input.tags.length) {
                const mappedTags = input.tags.map((e) => ({ ...e, userId: createdUser._id }));
                // await this.UserTagModel.insertMany(mappedTags);
            }

            //send mail with new password
            let template = await this.EmailTemplateModel.findOne({ uid: templatesSlug.WelcomeToPlatform });
            if (template) {

                const variables = {
                    '{{subject}}': template.subject,
                    '{{logo}}': this.configService.get('LOGO_URL'),
                    '{{project}}': this.configService.get('PROJECT'),
                    '{{name}}': `${input.firstName}`,
                    '{{YEAR}}': `${(new Date()).getFullYear()}`,
                    '{{email}}': input.email.toLowerCase(),
                    // '{{password}}': p,
                    '{{password}}': input?.password,
                    '{{frontendURL}}': this.configService.get('COMPANY_URL')
                }

                await this.sendmail.sendMail({
                    to: [input.email.toLowerCase()],
                    subject: template.subject,
                    html: this.commonService.replaceVariablesInTemplate(template.html, variables)
                })

                return {
                    message: message('en', 'USER_ADDED'),
                }
            }

            return {
                message: message('en', 'USER_ADDED')
            }

        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description User List
     * @param input 
     * @param user 
     * @returns 
     */
    // async usersList(input: DTO.UsersList, user: JWTUser) {
    //     try {
    //         // const companyId = user.roleId.name === Role.Company.name ? user._id : user.superiorId;
    //         // let query = { superiorId: companyId };
    //         if (input.search && input.search.trim()) {
    //             query["$or"] = [
    //                 {
    //                     $expr: {
    //                         $regexMatch: {
    //                             input: {
    //                                 $concat: ['$firstName', ' ', '$lastName']
    //                             },
    //                             regex: new RegExp(input.search.trim(), 'i')
    //                         }
    //                     }
    //                 },
    //                 { email: { $regex: input.search.trim(), $options: "i" } },
    //             ]

    //         }
    //         const list = await this.UserModel.aggregate([
    //             {
    //                 $match: query
    //             },
    //             {
    //                 $sort: { createdAt: -1 }
    //             },
    //             {
    //                 $facet: {
    //                     paginatedResults: [
    //                         { $skip: (input.page - 1) * input.limit },
    //                         { $limit: input.limit },
    //                         {
    //                             $lookup: {
    //                                 from: 'roles',
    //                                 as: 'role',
    //                                 let: { roleId: '$roleId' },
    //                                 pipeline: [
    //                                     {
    //                                         $match: {
    //                                             $expr: {
    //                                                 $eq: ['$_id', '$$roleId']
    //                                             }
    //                                         }
    //                                     },
    //                                     {
    //                                         $project: {
    //                                             name: 1,
    //                                             displayName: 1
    //                                         }
    //                                     }
    //                                 ]
    //                             }
    //                         },
    //                         {
    //                             $unwind: "$role"
    //                         },
    //                         {
    //                             $project: {
    //                                 firstName: 1,
    //                                 lastName: 1,
    //                                 email: 1,
    //                                 status: 1,
    //                                 mobilePhone: 1,
    //                                 role: "$role.displayName"
    //                             }
    //                         }
    //                     ],
    //                     totalCount: [
    //                         { $count: "total" },
    //                     ]
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     paginatedResults: 1,
    //                     totalCount: {
    //                         $cond: {
    //                             if: { $eq: [{ $size: "$totalCount" }, 0] },
    //                             then: 0,
    //                             else: { $arrayElemAt: ["$totalCount.total", 0] }
    //                         }
    //                     }
    //                 }
    //             }
    //         ]);

    //         return {
    //             data: {
    //                 records: list[0]?.paginatedResults,
    //                 total: list[0]?.totalCount
    //             }
    //         }
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    /**
     * @description Update user
     * @param input 
     * @param user 
     * @returns 
     */
    // async updateUser(input: DTO.UpdateUser, user: JWTUser) {
    //     try {
    //         const companyId = user.roleId.name === Role.Company.name ? user._id : user.superiorId;
    //         console.log({ _id: input.id, superiorId: companyId });

    //         const userExists = await this.UserModel.findOne({ _id: input.id, superiorId: companyId });
    //         console.log(userExists);

    //         if (!userExists) {
    //             throw new BadRequestException(message('en', 'USER_NF'));
    //         }
    //         //class
    //         if (input?.classId) {
    //             const classExists = await this.ClassesModel.findOne({ _id: input.classId, companyId }, { name: 1 });
    //             if (!classExists) {
    //                 throw new BadRequestException(message('en', 'CLASS_NF'));
    //             }
    //         }
    //         userExists.classId = input?.classId as any;

    //         //region
    //         if (input?.regionId) {
    //             const regionExists = await this.TreeModel.findOne({ _id: input.regionId, companyId }, { name: 1 });
    //             if (!regionExists) {
    //                 throw new BadRequestException(message('en', 'REGION_NF'));
    //             }
    //         }
    //         userExists.regionId = input?.regionId as any;

    //         //region
    //         // const timezoneExists = await this.TimezoneModel.findOne({ _id: input.timezoneId }, { zoneName: 1 });
    //         // if (!timezoneExists) {
    //         //     throw new BadRequestException(message('en', 'TIMEZONE_NF'));
    //         // }

    //         //update user password 
    //         if (input?.password) {
    //             userExists.password = bcrypt.hashSync(input?.password, 10);
    //         }
    //         // console.log("update user password", input?.password)

    //         userExists.firstName = input.firstName;
    //         userExists.lastName = input.lastName
    //         userExists.workPhone = input.workPhone;
    //         userExists.mobilePhone = input.mobilePhone;
    //         userExists.status = input.status;
    //         userExists.roleId = input.roleId as any;

    //         await userExists.save();
    //         // await this.UserDetailModel.updateOne({ userId: userExists._id }, {
    //         //     timezoneId: input.timezoneId
    //         // });
    //         await this.UserTagModel.deleteMany({ userId: userExists._id })
    //         if (input.tags && input.tags.length) {
    //             const mappedTags = input.tags.map((e) => ({ ...e, userId: userExists._id }));
    //             await this.UserTagModel.insertMany(mappedTags);
    //         }

    //         return {
    //             message: message('en', 'USER_UPDATED'),
    //         }
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    async changePassword(input: DTO.ChangeUserPassward, user: JWTUser) {
        try {
            // const companyId = user.roleId.name === Role.Company.name ? user._id : user.superiorId;
            const userExists = await this.UserModel.findOne({ _id: input.id });
            if (!userExists) {
                throw new BadRequestException(message('en', 'USER_NF'));
            }
            userExists.password = bcrypt.hashSync(input.password, 10);
            await userExists.save();
            return {
                message: message('en', 'USER_UPDATED'),
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Update user status
     * @param input 
     * @param user 
     * @returns 
     */
    // async updateUserStatus(input: DTO.UpdateUserStatus, user: JWTUser) {
    //     try {
    //         const companyId = user.roleId.name === Role.Company.name ? user._id : user.superiorId;
    //         const userExists = await this.UserModel.findOne({ _id: input.id, superiorId: companyId });
    //         if (!userExists) {
    //             throw new BadRequestException(message('en', 'USER_NF'));
    //         }

    //         userExists.status = input.status;
    //         await userExists.save();
    //         // await new Promise(resolve => setTimeout(resolve, 2000));
    //         // throw new BadRequestException('error');
    //         return {
    //             message: message('en', 'USER_STATUS_UPDATED'),
    //         }
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    /**
     * @description View User detail
     * @param input 
     * @param user 
     * @returns 
     */
    // async viewUser(input: DTO.ViewUser, user: JWTUser) {
    //     try {
    //         const companyId = user.roleId.name === Role.Company.name ? user._id : user.superiorId;
    //         const userExists = await this.UserModel.aggregate([
    //             {
    //                 $match: {
    //                     _id: new mongoose.Types.ObjectId(input.id),
    //                     superiorId: companyId
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'roles',
    //                     as: 'role',
    //                     let: { roleId: '$roleId' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $eq: ['$_id', '$$roleId']
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             $project: {
    //                                 name: 1,
    //                                 displayName: 1
    //                             }
    //                         }
    //                     ]
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     path: "$role",
    //                     preserveNullAndEmptyArrays: true
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'classes',
    //                     as: 'class',
    //                     let: { classId: '$classId' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $eq: ['$_id', '$$classId']
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             $project: {
    //                                 name: 1,
    //                             }
    //                         }
    //                     ]
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     path: "$class",
    //                     preserveNullAndEmptyArrays: true
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'trees',
    //                     as: 'region',
    //                     let: { regionId: '$regionId' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $eq: ['$_id', '$$regionId']
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             $project: {
    //                                 name: 1,
    //                             }
    //                         }
    //                     ]
    //                 }
    //             },
    //             {
    //                 $unwind: {
    //                     path: "$region",
    //                     preserveNullAndEmptyArrays: true
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'userdetails',
    //                     as: 'ud',
    //                     let: { userId: '$_id' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $eq: ['$userId', '$$userId']
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             $project: {
    //                                 timezoneId: 1
    //                             }
    //                         },
    //                         {
    //                             $lookup: {
    //                                 from: 'timezones',
    //                                 as: 'timezone',
    //                                 let: { timezoneId: '$timezoneId' },
    //                                 pipeline: [
    //                                     {
    //                                         $match: {
    //                                             $expr: {
    //                                                 $eq: ['$_id', '$$timezoneId']
    //                                             }
    //                                         }
    //                                     },
    //                                     {
    //                                         $project: {
    //                                             tzName: 1,
    //                                             abbreviation: 1
    //                                         }
    //                                     }
    //                                 ]
    //                             }
    //                         },
    //                         {
    //                             $unwind: "$timezone"
    //                         },

    //                     ]
    //                 }
    //             },
    //             {
    //                 $unwind: { path: "$ud", preserveNullAndEmptyArrays: true }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'usertags',
    //                     as: 'tags',
    //                     let: { userId: '$_id' },
    //                     pipeline: [
    //                         {
    //                             $match: {
    //                                 $expr: {
    //                                     $eq: ['$userId', '$$userId']
    //                                 }
    //                             }
    //                         },
    //                         {
    //                             $project: {
    //                                 tagId: 1,
    //                                 value: 1
    //                             }
    //                         },
    //                         {
    //                             $lookup: {
    //                                 from: 'tags',
    //                                 as: 'tag',
    //                                 let: { tagId: '$tagId' },
    //                                 pipeline: [
    //                                     {
    //                                         $match: {
    //                                             $expr: {
    //                                                 $eq: ['$_id', '$$tagId']
    //                                             }
    //                                         }
    //                                     },
    //                                     {
    //                                         $project: {
    //                                             name: 1
    //                                         }
    //                                     }
    //                                 ]
    //                             }
    //                         },
    //                         {
    //                             $unwind: "$tag"
    //                         },

    //                     ]
    //                 }
    //             },
    //             {
    //                 $project: {
    //                     firstName: 1,
    //                     lastName: 1,
    //                     email: 1,
    //                     status: 1,
    //                     workPhone: 1,
    //                     mobilePhone: 1,
    //                     role: 1,
    //                     class: 1,
    //                     region: 1,
    //                     timezone: "$ud.timezone",
    //                     tags: 1
    //                 }
    //             }
    //         ]);
    //         if (!userExists || !userExists.length) {
    //             throw new BadRequestException(message('en', 'USER_NF'));
    //         }
    //         return {
    //             data: userExists[0]
    //         }
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }
}
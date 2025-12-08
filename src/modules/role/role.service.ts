import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { permissionsList } from "src/constants/permissions-list";
import { Role, Permissions, User, RolePermissions } from "src/models";
import { Role as MRole } from 'src/constants/enum';
import * as DTO from "./role.dto";
import { message } from "src/constants/messages";
import { JWTUser } from "src/constants/interfaces";
import { CachingService } from "src/services/caching.service";


@Injectable()
export class RoleService {
    constructor(
        @InjectModel(Role.name) private RoleModel: Model<Role>,
        @InjectModel(Permissions.name) private PermissionsModel: Model<Permissions>,
        @InjectModel(User.name) private UserModel: Model<User>,
        @InjectModel(RolePermissions.name) private RolePermissionsModel: Model<RolePermissions>,
        private cache: CachingService,
    ) { }

    /**
     * @description Add Role
     * @returns 
     */
    async addRole(addRoleDTO: DTO.AddRole, user: JWTUser) {
        try {
            // const companyId = user.roleId.name === MRole.Company.name ? user._id : user.superiorId;
            let alteredName = addRoleDTO.name.replace(/\s+/g, '').toLowerCase();
            if (alteredName === 'admin') {
                throw new BadRequestException("Role cannot be created with this name");
            }
            const roleExists = await this.RoleModel.findOne({ name: alteredName });
            if (!roleExists) {
                const role = await this.RoleModel.create({ name: alteredName, displayName: addRoleDTO.name });
                return {
                    message: message('en', 'ROLE_CREATED'),
                    data: {
                        roleId: role._id
                    }
                }
            } else {
                throw new BadRequestException(message('en', 'ROLE_EXISTS'));
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Roles List
     * @param user 
     * @returns 
     */
    async rolesList(user: JWTUser) {
        try {
            // const companyId = user.roleId.name === MRole.Company.name ? user._id : user.superiorId;

            const list = await this.RoleModel.find({}, { displayName: 1 })
                .collation({ locale: 'en' })
                .sort({ displayName: 1 });
            return {
                data: list,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Update role permissions
     * @param updateRole 
     * @returns 
     */
    async updateRolePermissions(updateRole: DTO.UpdateRole, user: JWTUser) {
        try {
            // const companyId = user.roleId.name === MRole.Company.name ? user._id : user.superiorId;

            const allPermExists = await this.PermissionsModel.find({ _id: { $in: updateRole.permissions } }, { displayName: 1 });
            if (allPermExists.length === updateRole.permissions.length) {
                const roleExists = await this.RoleModel.findOne({ _id: updateRole.roleId });
                if (roleExists) {
                    await this.RolePermissionsModel.deleteMany({ roleId: roleExists._id })
                    const arrayToInsert = updateRole.permissions.map((e) => ({ permissionId: e, roleId: roleExists._id }));
                    await this.RolePermissionsModel.insertMany(arrayToInsert);
                    await this.cache.clear()
                    return {
                        message: message('en', 'ROLE_PERMISSION_UPDATED'),
                    }
                } else {
                    //err
                    throw new BadRequestException(message('en', 'ROLE_NF'));
                }
            } else {
                //err
                throw new BadRequestException(message('en', 'INVALID_PERM'));
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description Get role detail
     * @param roleDetail 
     * @param user 
     * @returns 
     */
    async getRoleDetail(roleDetail: DTO.RoleDetail, user: JWTUser) {
        try {
            // const companyId = user.roleId.name === MRole.Company.name ? user._id : user.superiorId;

            const roleExists = await this.RoleModel.findOne({ _id: roleDetail.roleId });
            if (roleExists) {
                const rolePermissions = await this.RolePermissionsModel.find({ roleId: roleExists._id })
                let rolePermissionsArr = rolePermissions.map((e) => e.permissionId);

                const permissions = await this.PermissionsModel.aggregate([
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            displayName: 1,
                            group: 1,
                            assigned: { $in: ["$_id", rolePermissionsArr] }
                        }
                    },
                    { $group: { _id: "$group", permissions: { "$push": "$$ROOT" } } },
                    { $sort: { _id: 1 } },
                ]);
                return {
                    data: {
                        permissions: permissions,
                        role: {
                            name: roleExists.name,
                            displayValue: roleExists.displayName
                        }
                    }
                }
            } else {
                throw new BadRequestException(message('en', 'ROLE_NF'));
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    /**
     * @description add and Update permission
     */
    // async syncPermissions() {
    //     try {
    //         // let companyRole = await this.RoleModel.findOne({ name: MRole.Company.name });
    //         if (companyRole) {
    //             for (let i = 0; i < permissionsList.length; i++) {
    //                 const el = permissionsList[i];
    //                 this.PermissionsModel.findOne({ name: el.name })
    //                     .then((pExists) => {
    //                         if (!pExists) {
    //                             this.PermissionsModel.create(el)
    //                                 .then((createdPermission) => {
    //                                     //add permission to every company
    //                                     this.RolePermissionsModel.create({ roleId: companyRole._id, permissionId: createdPermission._id })
    //                                         .catch(err => {
    //                                             console.log(err);
    //                                         })
    //                                 })
    //                                 .catch((er) => {
    //                                     console.log(er);
    //                                 })
    //                         } else {
    //                             pExists.displayName = el.displayName;
    //                             pExists.group = el.group;
    //                             pExists.order = el.order;
    //                             pExists.save()
    //                                 .catch((e) => {
    //                                     console.log(e);

    //                                 })
    //                         }
    //                     }).catch((err) => {
    //                         console.log(err);
    //                     })
    //             }
    //         }
    //         return {
    //             message: 'Synced'
    //         }
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    /**
     * @description delete the permission
     */
    async deleteRolePermission(data: DTO.DeleteRolePermissionsDto, user: JWTUser) {
        try {
            const permissionIds = data.permissions.map((item) => item.id);

            const deletePermissionsResult = await this.PermissionsModel.deleteMany({
                _id: { $in: permissionIds }
            });

            if (deletePermissionsResult.deletedCount === 0) {
                throw new BadRequestException('No permissions found to delete');
            }

            // Clean up role-permission associations in bulk
            await this.RolePermissionsModel.deleteMany({
                permissionId: { $in: permissionIds }
            });

            return {

                message: message('en', `${deletePermissionsResult.deletedCount} permissions deleted successfully`)
            };
        } catch (err) {
            throw new BadRequestException(err.message)
        }
    }


}
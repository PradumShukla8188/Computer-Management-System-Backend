import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { CachingService } from 'src/services/caching.service';
import { cachePrefix } from 'src/constants/enum';
import { InjectModel } from '@nestjs/mongoose';
import { RolePermissions } from 'src/models';
import { Model } from 'mongoose';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        @InjectModel(RolePermissions.name) private RolePermissionModel: Model<RolePermissions>,
        private cache: CachingService,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            // Now always stored as array in the decorator
            const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
                PERMISSIONS_KEY,
                [context.getHandler(), context.getClass()],
            );

            if (!requiredPermissions || !requiredPermissions.length) {
                return true;
            }

            const request = context.switchToHttp().getRequest();
            const userId = request['user']?._id;
            const roleId = request['user']?.roleId;

            if (!userId || !roleId) {
                return false;
            }

            // Try fetching permissions from cache
            // let permissionsList: string | string[] = await this.cache.get(`${cachePrefix}${userId}`);
            // if (permissionsList) {
            //     permissionsList = JSON.parse(permissionsList);
            // } else {
            //     // If not cached, fetch from DB
            //     permissionsList = await this.fetchPermissionsFromDB(roleId, userId);
            // }

            // if (!permissionsList || !permissionsList.length) {
            //     return false;
            // }

            // const hasPermission = requiredPermissions.some((perm) =>
            //     permissionsList.includes(perm),
            // );

            // return hasPermission;
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    /**
     * @description Fetch permissions from DB and cache them
     */
    private async fetchPermissionsFromDB(roleId: string, userId: string): Promise<string[]> {
        try {
            const rolePermissions = await this.RolePermissionModel.find(
                { roleId },
                { permissionId: 1 },
            ).populate('permissionId', { name: 1 });

            if (!rolePermissions.length) return [];

            const permissions = rolePermissions.map((item) => item.permissionId.name);

            // Save to cache
            await this.cache.set(`${cachePrefix}${userId}`, JSON.stringify(permissions));

            return permissions;
        } catch (error) {
            return [];
        }
    }
}

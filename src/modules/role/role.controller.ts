import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleService } from "./role.service";
import * as DTO from "./role.dto";
import { CurrentUser } from "src/services/currentUser.service";
// import { JWTUser } from "src/constants/interfaces";
import type { JWTUser } from "src/constants/interfaces";
import { Permission } from "src/decorators/permissions.decorator";
import { PermissionsGuard } from "src/guards/permission.guard";
import { PERMISSION_KEYS } from "src/constants/permissions-list";

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('Role')
@Controller('role')
export class RoleController {
    constructor(
        private service: RoleService
    ) { }

    @Post('add')
    @Permission(PERMISSION_KEYS.ADD_ROLES)
    @UseGuards(PermissionsGuard)
    @ApiOperation({ summary: 'Add Role - For Company' })
    addRole(@Body() addRoleDTO: DTO.AddRole, @CurrentUser() user: JWTUser) {
        return this.service.addRole(addRoleDTO, user);
    }

    @Get()
    @Permission(PERMISSION_KEYS.LIST_ROLES)
    @UseGuards(PermissionsGuard)
    @ApiOperation({ summary: "List Role - For Company" })
    rolesList(@CurrentUser() user: JWTUser) {
        return this.service.rolesList(user);
    }

    @Post('permission/update')
    @Permission(PERMISSION_KEYS.UPDATE_ROLES)
    @UseGuards(PermissionsGuard)
    @ApiOperation({ summary: 'Update Role Permission - For Company' })
    updateRolePermission(@Body() updateRolePerm: DTO.UpdateRole, @CurrentUser() user: JWTUser) {
        return this.service.updateRolePermissions(updateRolePerm, user);
    }

    // @Get('syncpq')
    // @ApiOperation({ summary: 'Sync Permissions and Roles' })
    // syncPermissionsAndRoles() {
    //     return this.service.syncPermissions();
    // }

    @Get('detail/:roleId')
    @ApiOperation({ summary: 'Get Role Detail' })
    getRoleDetail(@Param() detail: DTO.RoleDetail, @CurrentUser() user: JWTUser) {
        return this.service.getRoleDetail(detail, user);
    }

    @Post('delete-permission')
    @ApiOperation({ summary: 'Delete particular role Permission' })
    deletePermission(@Body() data: DTO.DeleteRolePermissionsDto, @CurrentUser() user: JWTUser) {
        return this.service.deleteRolePermission(data, user)
    }

}
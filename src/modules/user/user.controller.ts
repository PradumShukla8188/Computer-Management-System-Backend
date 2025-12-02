import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import * as DTO from "./user.dto";
import { UserService } from "./user.service";
import { CurrentUser } from "src/services/currentUser.service";
// import { JWTUser } from "src/constants/interfaces";
import type { JWTUser } from "src/constants/interfaces";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/guards/auth.guard";
import { AdminGuard } from "src/guards/admin.guard";
import { PERMISSION_KEYS } from "src/constants/permissions-list";
import { Permission } from "src/decorators/permissions.decorator";
import { PermissionsGuard } from "src/guards/permission.guard";

@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private service: UserService
    ) { }

    /**
     * @description Change password
     * @param cPass 
     * @param user 
     * @returns 
     */
    @Patch('change-password')
    @ApiOperation({ summary: 'Change Password' })
    ChangePassword(@Body() cPass: DTO.ChangePassward, @CurrentUser() user: JWTUser) {
        return this.service.changePassward(cPass, user)
    }

    /**
     * @description Update profile for admin
     * @param updateProfileA 
     * @param user 
     * @returns 
     */
    @Patch('profile/admin')
    @ApiOperation({ summary: 'Update profile for admin' })
    UpdateProfileAdmin(@Body() updateProfileA: DTO.UpdateProfileA, @CurrentUser() user: JWTUser) {
        return this.service.updateProfileA(updateProfileA, user)

    }

    /**
     * @description Dashboard stats(admin)
     * @returns 
     */
    @UseGuards(AdminGuard)
    @Get('admin/dashboard')
    @ApiOperation({ summary: 'Dashboard stats for admin' })
    AdminDashboard() {
        return this.service.adminDashboard();
    }

    /**
     * @description States List
     * @param input 
     * @returns 
     */
    @Get('states')
    @ApiOperation({ summary: 'States List' })
    StatesList(@Query() input: DTO.StatesList) {
        return this.service.statesList(input);
    }

    /**
     * @description List of timezones
     * @param input 
     * @returns 
     */
    @Get('timezones')
    @ApiOperation({ summary: 'Timezone List' })
    TimezoneList() {
        return this.service.timezoneList();
    }

    /**
     * @description City list
     * @param input 
     * @returns 
     */
    @Get('city')
    @ApiOperation({ summary: 'City List' })
    CityList(@Query() input: DTO.CityList) {
        return this.service.cityList(input);
    }

    /**
     * @description Add User
     */
    @Post('add')
    @Permission(PERMISSION_KEYS.ADD_USERS)
    @UseGuards(PermissionsGuard)
    @ApiOperation({ summary: 'Add User' })
    AddUser(@Body() input: DTO.AddUser, @CurrentUser() user: JWTUser) {
        return this.service.addUser(input, user);
    }

    /**
     * @description Users List
     */
    // @Post('list')
    // @Permission(PERMISSION_KEYS.LIST_USERS)
    // @UseGuards(PermissionsGuard)
    // @ApiOperation({ summary: 'Users List' })
    // UsersList(@Body() input: DTO.UsersList, @CurrentUser() user: JWTUser) {
    //     return this.service.usersList(input, user);
    // }

    // @Put('update')
    // @Permission(PERMISSION_KEYS.UPDATE_USERS)
    // @UseGuards(PermissionsGuard)
    // @ApiOperation({ summary: 'Update User' })
    // UpdateUser(@Body() input: DTO.UpdateUser, @CurrentUser() user: JWTUser) {
    //     return this.service.updateUser(input, user);
    // }

    @Put('update/password')
    @Permission(PERMISSION_KEYS.UPDATE_USERS)
    @UseGuards(PermissionsGuard)
    @ApiOperation({ summary: 'Update User password' })
    UpdateUserPassword(@Body() input: DTO.ChangeUserPassward, @CurrentUser() user: JWTUser) {
        return this.service.changePassword(input, user);
    }

    // @Put('update/status')
    // @Permission(PERMISSION_KEYS.UPDATE_USERS)
    // @UseGuards(PermissionsGuard)
    // @ApiOperation({ summary: 'Update User' })
    // UpdateUserStatus(@Body() input: DTO.UpdateUserStatus, @CurrentUser() user: JWTUser) {
    //     return this.service.updateUserStatus(input, user);
    // }

    // @Get('view/:id')
    // @ApiOperation({ summary: 'View User' })
    // viewUser(@Param() input: DTO.ViewUser, @CurrentUser() user: JWTUser) {
    //     return this.service.viewUser(input, user);
    // }
}
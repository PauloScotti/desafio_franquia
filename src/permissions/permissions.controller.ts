/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Post, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserMessagesHelper } from '../user/helpers/messages.helper';
import { PermissionsService } from './permissions.service';
import { PermissionsMessagesHelper } from './helpers/messages.helper';
import { PermissionsDto } from './dtos/permissions.dto';

@Controller()
export class PermissionsController {
    constructor(
        private readonly userService: UserService,
        private readonly permissionsService: PermissionsService
    ) { }

    @Get('permissions')
    async getUser(@Request() req) {
        const { userId } = req?.user;
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        const level = await this.permissionsService.getPermissionById((user.permissions).toString());

        if (!level) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_NOT_FOUND);
        }

        if (level.permissions === "Administrador") {

            return this.permissionsService.getPermissions();
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

    @Post('register_permissions')
    async registerPermissions(@Request() req, @Body() dto: PermissionsDto) {
        const { userId } = req?.user;
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        const level = await this.permissionsService.getPermissionById((user.permissions).toString());

        if (!level) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_NOT_FOUND);
        }

        if (level.permissions === "Administrador") {
            if (await this.permissionsService.existsByName(dto.permissions)) {
                throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_FOUND)
            }

            await this.permissionsService.create(dto);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

}
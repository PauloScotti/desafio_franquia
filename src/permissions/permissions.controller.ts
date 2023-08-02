/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserMessagesHelper } from '../user/helpers/messages.helper';
import { PermissionsService } from './permissions.service';
import { PermissionsMessagesHelper } from './helpers/messages.helper';
import { PermissionsDto } from './dtos/permissions.dto';

@Controller('adm/permissions')
export class PermissionsController {
    constructor(
        private readonly userService: UserService,
        private readonly permissionsService: PermissionsService
    ) { }

    @Get()
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

        if (level.cod === 1) {

            return this.permissionsService.getPermissions();
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

    @Post()
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

        if (level.cod === 1) {
            if (await this.permissionsService.existsByName(dto.permissions)) {
                throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_FOUND)
            }

            await this.permissionsService.create(dto);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

    @Put(":id")
    async updatePermissions(@Request() req, @Param() params, @Body() dto: PermissionsDto) {
        const { id } = params;
        const { userId } = req?.user;
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        const level = await this.permissionsService.getPermissionById((user.permissions).toString());

        if (!level) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_NOT_FOUND);
        }

        if (level.cod === 1) {
            if (await this.permissionsService.existsByName(dto.permissions)) {
                throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_FOUND)
            }

            await this.permissionsService.updatePermission(id, dto);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

    @Delete(":id")
    async deletePermissions(@Request() req, @Param() params) {
        const { id } = params;
        const { userId } = req?.user;
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        const level = await this.permissionsService.getPermissionById((user.permissions).toString());

        if (!level) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_NOT_FOUND);
        }

        if (level.cod === 1) {
            await this.permissionsService.deletePermission(id);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

}
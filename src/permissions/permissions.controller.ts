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


    async getUserNotFound(userId: any) {
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        return user;
    }

    async checkPermission(userId: any) {
        const user = await this.getUserNotFound(userId);

        const level = await this.permissionsService.getPermissionById((user.permissions).toString());

        if (!level) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_NOT_FOUND);
        }

        if (level.cod === 1) {
            return true;
        } else {
            return false;
        }
    }

    @Get()
    async getPermissions(@Request() req) {
        const { userId } = req?.user;

        const isAdm = await this.checkPermission(userId);

        if (isAdm) {
            return this.permissionsService.getPermissions();
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

    @Post()
    async registerPermissions(@Request() req, @Body() dto: PermissionsDto) {
        const { userId } = req?.user;

        const isAdm = await this.checkPermission(userId);

        if (isAdm) {
            if (await this.permissionsService.existsByName(dto.permissions)) {
                throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_FOUND)
            }

            await this.permissionsService.createdPermission(dto);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

    @Put(":id")
    async updatePermissions(@Request() req, @Param() params, @Body() dto: PermissionsDto) {
        const { id } = params;
        const { userId } = req?.user;

        const isAdm = await this.checkPermission(userId);

        if (isAdm) {
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

        const isAdm = await this.checkPermission(userId);

        if (isAdm) {
            const usersInPermission = await this.userService.getUserByPermission(id);

            if (usersInPermission.length > 0) {
                throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_HAS_USERS);
            } else {
                await this.permissionsService.deletePermission(id);
            }

        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

}
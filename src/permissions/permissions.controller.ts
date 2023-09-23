/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PermissionsService } from './permissions.service';
import { PermissionsMessagesHelper } from './helpers/messages.helper';
import { PermissionsDto } from './dtos/permissions.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Roles(Role.Admin)
@Controller('adm/permissions')
export class PermissionsController {
    constructor(
        private readonly userService: UserService,
        private readonly permissionsService: PermissionsService
    ) { }

    @Get()
    async getPermissions() {
        return this.permissionsService.getPermissions();
    }

    @Post()
    async registerPermissions(@Body() dto: PermissionsDto) {
        await this.permissionsService.createdPermission(dto);

    }

    @Put(":id")
    async updatePermissions(@Param() params, @Body() dto: PermissionsDto) {
        const { id } = params;

        if (await this.permissionsService.existsByName(dto.permissions)) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_FOUND)
        }

        await this.permissionsService.updatePermission(id, dto);

    }

    @Delete(":id")
    async deletePermissions(@Param() params) {
        const { id } = params;

        const usersInPermission = await this.userService.getUserByPermission(id);

        if (usersInPermission.length > 0) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_HAS_USERS);
        } else {
            await this.permissionsService.deletePermission(id);
        }

    }

}
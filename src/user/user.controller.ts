/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMessagesHelper } from './helpers/messages.helper';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsMessagesHelper } from 'src/permissions/helpers/messages.helper';
import { RegisterDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { UpdateUserAdmDto } from './dtos/updateadm.dto';

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly permissionsService: PermissionsService
    ) { }

    @Get('user')
    async getUser(@Request() req) {
        const { userId } = req?.user;
        const user = await this.userService.getUserById(userId);

        if (!user) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        return {
            name: user.name,
            email: user.email,
            permissions: user.permissions,
            id: user._id,
        }
    }

    @Get('user/:id')
    async getUserByMId(@Request() req, @Param() params) {
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
            return await this.userService.getUserById(id);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

    @Put('user')
    async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
        const { userId } = req?.user;
        await this.userService.updateuser(userId, dto);
    }

    @Get('adm/users')
    async getUsers(@Request() req) {
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
            return await this.userService.getUsers()
        } else {
            return await this.userService.getUserByFranchise((user.franchise).toString())
        }
    }

    @Put('adm/users/:id')
    async updateUserByAdm(@Request() req, @Param() params, @Body() dto: UpdateUserAdmDto) {
        const { id } = params;
        const { userId } = req?.user;
        const loggedUser = await this.userService.getUserById(userId);

        if (!loggedUser) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        const levelLoggedUser = await this.permissionsService.getPermissionById((loggedUser.permissions).toString());

        if (!levelLoggedUser) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_NOT_FOUND);
        }

        if (levelLoggedUser.cod === 1) {
            if (await this.userService.existsByEmail(dto.email)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND)
            }

            if (await this.userService.existsByLogin(dto.login)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND)
            }

            await this.userService.updateUserByAdm(id, dto);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

    @Post('register')
    async registerUser(@Request() req, @Body() dto: RegisterDto) {
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
            if (await this.userService.existsByEmail(dto.email)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND)
            }

            if (await this.userService.existsByLogin(dto.login)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND)
            }

            return this.userService.create(dto)
        } else if (level.cod === 2) {
            if (await this.userService.existsByEmail(dto.email)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND)
            }

            if (await this.userService.existsByLogin(dto.login)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND)
            }

            const level = await this.permissionsService.getPermissionByCode(3)

            dto.permissions = (level._id).toString();
            dto.franchise = (user.franchise).toString();

            return this.userService.create(dto)
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }


    @Delete('adm/users/:id')
    async deleteUserByAdm(@Request() req, @Param() params) {
        const { id } = params;
        const { userId } = req?.user;
        const loggedUser = await this.userService.getUserById(userId);

        if (!loggedUser) {
            throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
        }

        const levelLoggedUser = await this.permissionsService.getPermissionById((loggedUser.permissions).toString());

        if (!levelLoggedUser) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_NOT_FOUND);
        }

        if (levelLoggedUser.cod === 1) {
            await this.userService.deleteUserByAdm(id);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

}
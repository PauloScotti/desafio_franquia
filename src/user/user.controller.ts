/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Post, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMessagesHelper } from './helpers/messages.helper';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsMessagesHelper } from 'src/permissions/helpers/messages.helper';
import { RegisterDto } from './dtos/RegisterDto';

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

        if (level.permissions === "Administrador") {
            if (await this.userService.existsByEmail(dto.email)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND)
            }

            if (await this.userService.existsByLogin(dto.login)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND)
            }

            return this.userService.create(dto)
        } else if (level.permissions === "Gestor") {
            if (await this.userService.existsByEmail(dto.email)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND)
            }

            if (await this.userService.existsByLogin(dto.login)) {
                throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND)
            }

            const level = await this.permissionsService.getPermissionByName("Colaborador")

            dto.permissions = (level._id).toString();
            dto.franchise = (user.franchise).toString()

            return this.userService.create(dto)
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }

    }

}
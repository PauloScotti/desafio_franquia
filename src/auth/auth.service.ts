/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { MessagesHelper } from './helpers/messages.helper';
import { UserService } from 'src/user/user.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { FranchiseService } from 'src/franchise/franchise.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private looger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly permissionsService: PermissionsService,
        private readonly franchiseService: FranchiseService,
        private readonly jwtService: JwtService,
    ) { }

    async login(dto: LoginDto) {
        this.looger.debug('login - started');

        const user = await this.userService.getUserByLoginPassword(dto.login, dto.password)
        if (user == null) {
            throw new BadRequestException(MessagesHelper.AUTH_PASSWORD_OR_LOGIN_NOT_FOUND)
        }

        const tokenPayload = { email: user.email, sub: user._id };

        const level = await this.permissionsService.getPermissionById((user.permissions).toString());

        return {
            email: user.email,
            name: user.name,
            permissionId: user.permissions,
            permissionName: level.permissions,
            token: this.jwtService.sign(tokenPayload, { secret: process.env.USER_JWT_SECRET_KEY })
        }
    }

}

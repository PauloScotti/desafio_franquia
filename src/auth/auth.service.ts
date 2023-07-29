/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { MessagesHelper } from './helpers/messages.helper';
import { RegisterDto } from 'src/user/dtos/RegisterDto';
import { UserService } from 'src/user/user.service';
import { UserMessagesHelper } from 'src/user/helpers/messages.helper';
import { PermissionsDto } from 'src/permissions/dtos/permissions.dto';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsMessagesHelper } from 'src/permissions/helpers/messages.helper';
import { FranchiseDto } from 'src/franchise/dtos/franchise.dto';
import { FranchiseService } from 'src/franchise/franchise.service';
import { FranchiseMessagesHelper } from 'src/franchise/helpers/messages.helper';

@Injectable()
export class AuthService {
    private looger = new Logger(AuthService.name);

    constructor(
        private readonly userService: UserService,
        private readonly permissionService: PermissionsService,
        private readonly franchiseService: FranchiseService,
    ) { }

    login(dto: LoginDto) {
        if (dto.login !== 'teste@teste.com' || dto.password !== 'teste123') {
            throw new BadRequestException(MessagesHelper.AUTH_PASSWORD_OR_LOGIN_NOT_FOUND);
        }

        return dto
    }

    async registerPermissions(dto: PermissionsDto) {
        this.looger.debug('registerPermissions - started');
        if (await this.permissionService.existsByName(dto.permissions)) {
            throw new BadRequestException(PermissionsMessagesHelper.PERMISSION_FOUND)
        }

        await this.permissionService.create(dto);
    }

    async registerFranchise(dto: FranchiseDto) {
        this.looger.debug('registerPermissions - started');
        if (await this.franchiseService.existsByName(dto.franchise)) {
            throw new BadRequestException(FranchiseMessagesHelper.REGISTER_FRANCHISE_FOUND)
        }

        await this.franchiseService.create(dto);
    }

    async register(dto: RegisterDto) {
        this.looger.debug('register - started');
        if (await this.userService.existsByEmail(dto.email)) {
            throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND)
        }

        if (await this.userService.existsByLogin(dto.login)) {
            throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND)
        }

        await this.userService.create(dto);
    }
}

/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { UserService } from 'src/user/user.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserMessagesHelper } from 'src/user/helpers/messages.helper';
import { PermissionsMessagesHelper } from 'src/permissions/helpers/messages.helper';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
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

        return level.cod;
    }

    async canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // usar o user acima para checar a permissão no banco e retornar abaixo
        const level = await this.checkPermission(user.userId);

        // Verificar se o level é igual a um dos valores em requiredRoles
        if (requiredRoles.includes(level)) {
            return true;
        } else {
            // Se não, retornar falso ou lançar uma exceção, dependendo do seu requisito
            return false;
            // Ou lançar uma exceção
            // throw new ForbiddenException('Acesso negado');
        }
    }
}
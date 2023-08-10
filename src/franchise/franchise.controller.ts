/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserMessagesHelper } from '../user/helpers/messages.helper';
import { PermissionsService } from '../permissions/permissions.service';
import { PermissionsMessagesHelper } from '../permissions/helpers/messages.helper';
import { FranchiseService } from './franchise.service';
import { FranchiseDto } from './dtos/franchise.dto';
import { FranchiseMessagesHelper } from './helpers/messages.helper';

@Controller('adm/franchise')
export class FranchinseController {
    constructor(
        private readonly userService: UserService,
        private readonly franchiseService: FranchiseService,
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

            return this.franchiseService.getFranchise();
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

    @Post()
    async registerFranchise(@Request() req, @Body() dto: FranchiseDto) {
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
            if (await this.franchiseService.existsByName(dto.franchise)) {
                throw new BadRequestException(FranchiseMessagesHelper.REGISTER_FRANCHISE_FOUND)
            }

            await this.franchiseService.create(dto);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

    @Put(":id")
    async updateFranchise(@Request() req, @Param() params, @Body() dto: FranchiseDto) {
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
            if (await this.franchiseService.existsByName(dto.franchise)) {
                throw new BadRequestException(FranchiseMessagesHelper.REGISTER_FRANCHISE_FOUND)
            }

            await this.franchiseService.updateFranchise(id, dto);
        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

    @Delete(":id")
    async deleeFranchise(@Request() req, @Param() params) {
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

            const usersInFranchise = await this.userService.getUserByFranchise(id);

            if (usersInFranchise.length > 0) {
                throw new BadRequestException(FranchiseMessagesHelper.FRANCHISE_HAS_USERS);
            } else {
                await this.franchiseService.deleteFranchise(id);
            }

        } else {
            throw new UnauthorizedException(PermissionsMessagesHelper.PERMISSION_UNAUTHORIZED);
        }
    }

}
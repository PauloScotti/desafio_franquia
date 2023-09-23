/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { FranchiseService } from './franchise.service';
import { FranchiseDto } from './dtos/franchise.dto';
import { FranchiseMessagesHelper } from './helpers/messages.helper';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';

@Roles(Role.Admin)
@Controller('adm/franchise')
export class FranchinseController {
    constructor(
        private readonly userService: UserService,
        private readonly franchiseService: FranchiseService
    ) { }


    @Get()
    async getFranchise() {
        return this.franchiseService.getFranchise();
    }

    @Post()
    async registerFranchise(@Body() dto: FranchiseDto) {
        if (await this.franchiseService.existsByName(dto.franchise)) {
            throw new BadRequestException(FranchiseMessagesHelper.REGISTER_FRANCHISE_FOUND)
        }

        await this.franchiseService.createdFranchise(dto);
    }

    @Put(":id")
    async updateFranchise(@Param() params, @Body() dto: FranchiseDto) {
        const { id } = params;

        if (await this.franchiseService.existsByName(dto.franchise)) {
            throw new BadRequestException(FranchiseMessagesHelper.REGISTER_FRANCHISE_FOUND)
        }

        await this.franchiseService.updateFranchise(id, dto);
    }

    @Delete(":id")
    async deleeFranchise(@Param() params) {
        const { id } = params;

        const usersInFranchise = await this.userService.getUserByFranchise(id);

        if (usersInFranchise.length > 0) {
            throw new BadRequestException(FranchiseMessagesHelper.FRANCHISE_HAS_USERS);
        } else {
            await this.franchiseService.deleteFranchise(id);
        }
    }

}
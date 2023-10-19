/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserMessagesHelper } from './helpers/messages.helper';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PermissionsMessagesHelper } from 'src/permissions/helpers/messages.helper';
import { RegisterDto } from './dtos/register.dto';
import { UpdateUserDto } from './dtos/update.dto';
import { UpdateUserAdmDto } from './dtos/updateadm.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { GetUserDto } from './dtos/getuser.dto';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async getUserNotFound(userId: any) {
    const user = await this.userService.getUserById(userId);

    if (!user) {
      throw new BadRequestException(UserMessagesHelper.GET_USER_NOT_FOUND);
    }

    return user;
  }

  async checkPermission(userId: any) {
    const user = await this.getUserNotFound(userId);

    const level = await this.permissionsService.getPermissionById(
      user.permissions.toString(),
    );

    if (!level) {
      throw new BadRequestException(
        PermissionsMessagesHelper.PERMISSION_NOT_FOUND,
      );
    }

    return level;
  }

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
    };
  }

  @Roles(Role.Admin)
  @Get('user/:id')
  async getUserById(@Param() params) {
    const { id } = params;

    const result = await this.userService.getUserById(id);

    return {
      id: result._id.toString(),
      login: result.login,
      email: result.email,
      permissions: result.permissions,
      franchise: result.franchise,
    } as unknown as GetUserDto;
  }

  @Put('user')
  async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
    const { userId } = req?.user;
    await this.userService.updateuser(userId, dto);
  }

  @Get('users')
  async getUsers(@Request() req) {
    const { userId } = req?.user;
    const user = await this.getUserNotFound(userId);

    const result = await this.userService.getUserByFranchise(
      user.franchise.toString(),
    );

    return result.map(
      (user) =>
        ({
          id: user._id.toString(),
          login: user.login,
          email: user.email,
          permissions: user.permissions,
          franchise: user.franchise,
        } as unknown as GetUserDto),
    );
  }

  @Get('adm/users')
  @Roles(Role.Admin)
  async getUsersByAdm() {
    const result = await this.userService.getUsers();

    return result.map(
      (user) =>
        ({
          id: user._id.toString(),
          login: user.login,
          email: user.email,
          permissions: user.permissions,
          franchise: user.franchise,
        } as unknown as GetUserDto),
    );
  }

  @Put('adm/users/:id')
  @Roles(Role.Admin)
  async updateUserByAdm(@Param() params, @Body() dto: UpdateUserAdmDto) {
    const { id } = params;

    await this.userService.updateUserByAdm(id, dto);
  }

  @Post('register')
  @Roles(Role.Manager)
  async registerUser(@Request() req, @Body() dto: RegisterDto) {
    const { userId } = req?.user;
    const user = await this.getUserNotFound(userId);

    if (await this.userService.existsByEmail(dto.email)) {
      throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND);
    }

    if (await this.userService.existsByLogin(dto.login)) {
      throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND);
    }

    const level = await this.permissionsService.getPermissionByCode(3);

    dto.permissions = level._id.toString();
    dto.franchise = user.franchise.toString();

    return this.userService.createdUser(dto);
  }

  @Post('adm/register')
  @Roles(Role.Admin)
  async registerUserByAdm(@Body() dto: RegisterDto) {
    if (await this.userService.existsByEmail(dto.email)) {
      throw new BadRequestException(UserMessagesHelper.REGISTER_EMAIL_FOUND);
    }

    if (await this.userService.existsByLogin(dto.login)) {
      throw new BadRequestException(UserMessagesHelper.REGISTER_LOGIN_FOUND);
    }

    return this.userService.createdUser(dto);
  }

  @Roles(Role.Admin)
  @Delete('adm/users/:id')
  async deleteUserByAdm(@Param() params) {
    const { id } = params;

    await this.userService.deleteUserByAdm(id);
  }
}

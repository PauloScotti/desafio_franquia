/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from 'src/user/dtos/RegisterDto';
import { PermissionsDto } from 'src/permissions/dtos/permissions.dto';
import { FranchiseDto } from 'src/franchise/dtos/franchise.dto';

@Controller('auth')
export class AuthController {
    private logger = new Logger(AuthService.name);
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        this.logger.debug('login - started');
        return this.authService.login(dto);
    }

    @Post('register_permissions')
    @HttpCode(HttpStatus.OK)
    registerPermissions(@Body() dto: PermissionsDto) {
        return this.authService.registerPermissions(dto);
    }

    @Post('register_franchise')
    @HttpCode(HttpStatus.OK)
    registerFranchise(@Body() dto: FranchiseDto) {
        return this.authService.registerFranchise(dto);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }
}

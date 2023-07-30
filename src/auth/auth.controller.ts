/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { IsPublic } from './decorators/ispublic.decorator';

@Controller('auth')
export class AuthController {
    private logger = new Logger(AuthService.name);
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @IsPublic()
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginDto) {
        this.logger.debug('login - started');
        return this.authService.login(dto);
    }
}

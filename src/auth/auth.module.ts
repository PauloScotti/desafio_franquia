/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { FranchiseModule } from 'src/franchise/franchise.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        UserModule,
        PermissionsModule,
        FranchiseModule,
        JwtModule.register({
            secret: process.env.USER_JWT_SECRET_KEY,
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule { }
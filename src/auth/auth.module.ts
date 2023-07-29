/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { FranchiseModule } from 'src/franchise/franchise.module';

@Module({
    imports: [UserModule, PermissionsModule, FranchiseModule],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
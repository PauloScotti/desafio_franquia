/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permissions, PermissionsSchema } from 'src/permissions/schemas/permissions.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Permissions.name, schema: PermissionsSchema },
    ])],
    controllers: [UserController],
    providers: [UserService, PermissionsService],
    exports: [MongooseModule, UserService]
})
export class UserModule { }
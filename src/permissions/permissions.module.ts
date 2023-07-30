/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permissions, PermissionsSchema } from './schemas/permissions.schema';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Permissions.name, schema: PermissionsSchema },
        { name: User.name, schema: UserSchema }
    ])],
    controllers: [PermissionsController],
    providers: [PermissionsService, UserService],
    exports: [MongooseModule, PermissionsService]
})
export class PermissionsModule { }
/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Franchise, FranchiseSchema } from './schemas/franchise.schema';
import { FranchiseService } from './franchise.service';
import { Permissions, PermissionsSchema } from 'src/permissions/schemas/permissions.schema';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { FranchinseController } from './franchise.controller';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Franchise.name, schema: FranchiseSchema },
        { name: Permissions.name, schema: PermissionsSchema },
        { name: User.name, schema: UserSchema }
    ])],
    controllers: [FranchinseController],
    providers: [FranchiseService, PermissionsService, UserService],
    exports: [MongooseModule, FranchiseService]
})
export class FranchiseModule { }
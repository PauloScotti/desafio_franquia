/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { PermissionsService } from 'src/permissions/permissions.service';
import {
  Permissions,
  PermissionsSchema,
} from 'src/permissions/schemas/permissions.schema';
import {
  Franchise,
  FranchiseSchema,
} from 'src/franchise/schemas/franchise.schema';
import { FranchiseService } from 'src/franchise/franchise.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permissions.name, schema: PermissionsSchema },
      { name: Franchise.name, schema: FranchiseSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, PermissionsService, FranchiseService],
  exports: [MongooseModule, UserService],
})
export class UserModule {}

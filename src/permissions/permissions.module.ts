/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Permissions, PermissionsSchema } from './schemas/permissions.schema';
import { PermissionsService } from './permissions.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Permissions.name, schema: PermissionsSchema },])],
    controllers: [],
    providers: [PermissionsService],
    exports: [MongooseModule, PermissionsService]
})
export class PermissionsModule { }
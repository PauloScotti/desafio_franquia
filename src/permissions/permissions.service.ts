/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permissions, PermissionsDocument } from './schemas/permissions.schema';
import { PermissionsDto } from './dtos/permissions.dto';

@Injectable()
export class PermissionsService {
    constructor(@InjectModel(Permissions.name) private permissionsModel: Model<PermissionsDocument>) { }

    async create(dto: PermissionsDto): Promise<Permissions> {
        const createdPermission = new this.permissionsModel(dto);
        return createdPermission.save();
    }

    async existsByName(permissions: string): Promise<boolean> {
        const result = await this.permissionsModel.find({ permissions });
        if (result && result.length > 0) {
            return true;
        }
        return false;
    }

    async getPermissions() {
        return await this.permissionsModel.find();
    }

    async getPermissionById(id: string) {
        return await this.permissionsModel.findById(id);
    }

    async getPermissionByName(name: string) {
        return await this.permissionsModel.findOne({ permissions: name });
    }
}
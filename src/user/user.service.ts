/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from 'src/user/dtos/register.dto';
import * as CryptoJS from "crypto-js";
import { UpdateUserDto } from './dtos/update.dto';
import { UpdateUserAdmDto } from './dtos/updateadm.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async create(dto: RegisterDto): Promise<User> {
        dto.password = CryptoJS.AES.encrypt(dto.password, process.env.USER_CYPHER_SECRET_KEY).toString();

        const createdUser = new this.userModel(dto);
        return createdUser.save();
    }

    async createByManager(dto: RegisterDto): Promise<User> {
        dto.password = CryptoJS.AES.encrypt(dto.password, process.env.USER_CYPHER_SECRET_KEY).toString();

        const createdUser = new this.userModel(dto);
        return createdUser.save();
    }

    async existsByEmail(email: string): Promise<boolean> {
        const result = await this.userModel.find({ email });
        if (result && result.length > 0) {
            return true;
        }
        return false;
    }

    async existsByLogin(login: string): Promise<boolean> {
        const result = await this.userModel.find({ login });
        if (result && result.length > 0) {
            return true;
        }
        return false;
    }

    async getUserByLoginPassword(login: string, password: string): Promise<UserDocument | null> {
        const user = await this.userModel.findOne({ login }) as UserDocument;

        if (user) {
            const bytes = CryptoJS.AES.decrypt(user.password, process.env.USER_CYPHER_SECRET_KEY);
            const savedPassword = bytes.toString(CryptoJS.enc.Utf8);

            if (password == savedPassword) {
                return user;
            }
        }

        return null;
    }

    async getUserById(id: string) {
        return await this.userModel.findById(id);
    }

    async getUsers() {
        return await this.userModel.find();
    }

    async getUserByFranchise(franchise: string) {
        return await this.userModel.find({ franchise: franchise });
    }

    async getUserByPermission(permissions: string) {
        return await this.userModel.find({ permissions: permissions });
    }

    async updateuser(id: string, dto: UpdateUserDto) {
        return await this.userModel.findByIdAndUpdate(id, dto);
    }

    async updateUserByAdm(id: string, dto: UpdateUserAdmDto) {
        return await this.userModel.findByIdAndUpdate(id, dto);
    }

    async deleteUserByAdm(id: string) {
        return await this.userModel.findByIdAndDelete(id);
    }

}
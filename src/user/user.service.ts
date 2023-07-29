/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto } from 'src/user/dtos/RegisterDto';
import * as CryptoJS from "crypto-js";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(dto: RegisterDto): Promise<User> {
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
}
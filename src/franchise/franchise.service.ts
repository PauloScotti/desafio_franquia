/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Franchise, FranchiseDocument } from './schemas/franchise.schema';
import { FranchiseDto } from './dtos/franchise.dto';

@Injectable()
export class FranchiseService {
    constructor(@InjectModel(Franchise.name) private franchiseModel: Model<FranchiseDocument>) { }

    async createdFranchise(dto: FranchiseDto): Promise<Franchise> {
        const createdFranchise = new this.franchiseModel(dto);
        return createdFranchise.save();
    }

    async getFranchise() {
        return await this.franchiseModel.find();
    }

    async existsByName(franchise: string): Promise<boolean> {
        const result = await this.franchiseModel.find({ franchise });
        if (result && result.length > 0) {
            return true;
        }
        return false;
    }

    async getFranchiseById(id: string) {
        return await this.franchiseModel.findById(id);
    }

    async updateFranchise(id: string, dto: FranchiseDto) {
        return await this.franchiseModel.findByIdAndUpdate(id, dto);
    }

    async deleteFranchise(id: string) {
        return await this.franchiseModel.findByIdAndDelete(id);
    }
}
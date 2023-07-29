/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Franchise, FranchiseSchema } from './schemas/franchise.schema';
import { FranchiseService } from './franchise.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Franchise.name, schema: FranchiseSchema },])],
    controllers: [],
    providers: [FranchiseService],
    exports: [MongooseModule, FranchiseService]
})
export class FranchiseModule { }
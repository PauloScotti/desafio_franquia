/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { Stock, StockSchema } from './schemas/stock.schema';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { Products, ProductsSchema } from 'src/products/schemas/products.schema';
import {
  Franchise,
  FranchiseSchema,
} from 'src/franchise/schemas/franchise.schema';
import { ProductsService } from 'src/products/products.service';
import { FranchiseService } from 'src/franchise/franchise.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Stock.name, schema: StockSchema },
      { name: Products.name, schema: ProductsSchema },
      { name: Franchise.name, schema: FranchiseSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [StockController],
  providers: [StockService, UserService, ProductsService, FranchiseService],
  exports: [MongooseModule, StockService],
})
export class StockModule {}

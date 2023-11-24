/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Franchise, Products, ProductsSchema } from './schemas/products.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { StockService } from 'src/stock/stock.service';
import { Stock, StockSchema } from 'src/stock/schemas/stock.schema';
import { FranchiseSchema } from 'src/franchise/schemas/franchise.schema';
import { FranchiseService } from 'src/franchise/franchise.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Products.name, schema: ProductsSchema },
      { name: Franchise.name, schema: FranchiseSchema },
      { name: Stock.name, schema: StockSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, UserService, StockService, FranchiseService],
  exports: [MongooseModule, ProductsService],
})
export class ProductsModule {}

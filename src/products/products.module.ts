/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Products, ProductsSchema } from './schemas/products.schema';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Products.name, schema: ProductsSchema },
        { name: User.name, schema: UserSchema }
    ])],
    controllers: [ProductsController],
    providers: [ProductsService, UserService],
    exports: [MongooseModule, ProductsService]
})
export class ProductsModule { }
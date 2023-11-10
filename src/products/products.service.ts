/* eslint-disable prettier/prettier */
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Products, ProductsDocument } from './schemas/products.schema';
import { ProductsDto } from './dtos/products.dto';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Products.name) private productsModel: Model<ProductsDocument>) { }

    async createdProduct(dto: ProductsDto): Promise<Products> {
        const createdProduct = new this.productsModel(dto);
        return createdProduct.save();
    }

    async existsByName(nome: string): Promise<boolean> {
        const result = await this.productsModel.find({ nome });
        if (result && result.length > 0) {
            return true;
        }
        return false;
    }

    async getProducts() {
        return await this.productsModel.find();
    }

    async getProductById(id: string) {
        return await this.productsModel.findById(id);
    }

    async getProductByCode(cod: number) {
        return await this.productsModel.findOne({ cod: cod });
    }

    async updateProduct(id: string, dto: ProductsDto) {
        return await this.productsModel.findByIdAndUpdate(id, dto);
    }

    async deleteProduct(id: string) {
        return await this.productsModel.findByIdAndDelete(id);
    }
}
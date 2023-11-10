/* eslint-disable prettier/prettier */
import { IsArray, Min, MinLength } from 'class-validator';
import { ProductsMessagesHelper } from '../helpers/messages.helper';
import { FranchiseMessagesHelper } from 'src/franchise/helpers/messages.helper';

export class ProductsDto {

    @MinLength(4, { message: ProductsMessagesHelper.PRODUCT_NOT_FOUND })
    nome: string;

    @Min(1, { message: ProductsMessagesHelper.PRICE_PRODUCT_NOT_FOUND })
    price: number;

    @IsArray({ message: FranchiseMessagesHelper.REGISTER_FRANCHISE_NOT_FOUND })
    franchises: [{ franchise: string, amount: number }]
}
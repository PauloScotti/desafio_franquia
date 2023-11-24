/* eslint-disable prettier/prettier */
import { IsArray, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { FranchiseMessagesHelper } from 'src/franchise/helpers/messages.helper';
import { ProductsMessagesHelper } from '../helpers/messages.helper';

export class UpdateProductsDto {
  @IsOptional()
  @MinLength(4, { message: ProductsMessagesHelper.PRODUCT_NOT_FOUND })
  nome: string;

  @IsOptional()
  @Min(1, { message: ProductsMessagesHelper.PRICE_PRODUCT_NOT_FOUND })
  price: number;

  @IsOptional()
  @IsArray({ message: FranchiseMessagesHelper.REGISTER_FRANCHISE_NOT_FOUND })
  franchises: Array<{
    franchise: string;
    amountSold: number;
    amountPurchase: number;
    amount: number;
    saleDate: Date;
    purchaseDate: Date;
  }>;
}

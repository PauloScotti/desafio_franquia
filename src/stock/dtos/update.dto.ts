/* eslint-disable prettier/prettier */
import { IsDate, IsNumber, IsOptional, Min, MinLength } from 'class-validator';
import { FranchiseMessagesHelper } from 'src/franchise/helpers/messages.helper';
import { ProductsMessagesHelper } from 'src/products/helpers/messages.helper';
import { StockMessagesHelper } from '../helpers/messages.helper';

export class UpdateStockDto {
  @IsOptional()
  @MinLength(4, { message: ProductsMessagesHelper.PRODUCT_NOT_FOUND })
  productId: string;

  @IsOptional()
  @MinLength(4, {
    message: FranchiseMessagesHelper.REGISTER_FRANCHISE_NOT_FOUND,
  })
  franchiseId: string;

  @IsOptional()
  @Min(1, { message: StockMessagesHelper.PRODUCT_SALE_AMOUNT })
  amountSold: number;

  @IsOptional()
  @Min(1, { message: StockMessagesHelper.PRODUCT_PURCHASE_AMOUNT })
  amountPurchase: number;

  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDate({ message: StockMessagesHelper.PRODUCT_SALE_DATE })
  saleDate: Date;

  @IsOptional()
  @IsDate({ message: StockMessagesHelper.PRODUCT_PURCHASE_DATE })
  purchaseDate: Date;
}

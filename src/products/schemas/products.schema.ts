import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductsDocument = HydratedDocument<Products>;

@Schema()
export class Franchise {
  @Prop({ required: true })
  franchise: string;

  @Prop({ default: 0 })
  amountSold?: number;

  @Prop({ default: 0 })
  amountPurchase?: number;

  @Prop({ default: 0 })
  amount?: number;

  @Prop()
  saleDate?: Date;

  @Prop()
  purchaseDate?: Date;
}

@Schema()
export class Products {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  price: number;

  @Prop([Franchise]) // Definindo a propriedade como um array de Franchise
  franchises: Franchise[];
}

export const ProductsSchema = SchemaFactory.createForClass(Products);

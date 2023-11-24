import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StockDocument = HydratedDocument<Stock>;

@Schema()
export class Stock {
  @Prop({ required: true })
  franchiseId: string;

  @Prop({ required: true })
  productId: string;

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

export const StockSchema = SchemaFactory.createForClass(Stock);

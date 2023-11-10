/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ProductsDocument = HydratedDocument<Products>;

@Schema()
export class Products {
    @Prop({ required: true })
    nome: string;

    @Prop({ required: true })
    price: number;

    @Prop({ required: true })
    franchises: [{ franchise: string, amount: number }]

}

export const ProductsSchema = SchemaFactory.createForClass(Products);
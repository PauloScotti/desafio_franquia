/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type FranchiseDocument = HydratedDocument<Franchise>;

@Schema()
export class Franchise {
    @Prop({ required: true })
    franchise: string;

}

export const FranchiseSchema = SchemaFactory.createForClass(Franchise);
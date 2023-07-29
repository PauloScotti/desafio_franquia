/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type PermissionsDocument = HydratedDocument<Permissions>;

@Schema()
export class Permissions {
    @Prop({ required: true })
    permissions: string;

}

export const PermissionsSchema = SchemaFactory.createForClass(Permissions);
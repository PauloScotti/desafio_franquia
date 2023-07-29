/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Permissions } from '../../permissions/schemas/permissions.schema';
import { Franchise } from '../../franchise/schemas/franchise.schema';
export type UserDocument = mongoose.HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    login: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'permissions' })
    permissions: Permissions

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Franchise' })
    franchise: Franchise
}

export const UserSchema = SchemaFactory.createForClass(User);
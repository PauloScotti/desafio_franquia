/* eslint-disable prettier/prettier */
import { Min, MinLength } from 'class-validator';
import { PermissionsMessagesHelper } from '../helpers/messages.helper';

export class PermissionsDto {

    @MinLength(4, { message: PermissionsMessagesHelper.PERMISSION_NOT_FOUND })
    permissions: string;

    @Min(1, { message: PermissionsMessagesHelper.CODE_PERMISSION_NOT_FOUND })
    cod: number;
}
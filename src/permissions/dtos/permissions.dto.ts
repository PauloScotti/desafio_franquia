/* eslint-disable prettier/prettier */
import { MinLength } from 'class-validator';
import { PermissionsMessagesHelper } from '../helpers/messages.helper';

export class PermissionsDto {

    @MinLength(4, { message: PermissionsMessagesHelper.PERMISSION_NOT_FOUND })
    permissions: string;
}
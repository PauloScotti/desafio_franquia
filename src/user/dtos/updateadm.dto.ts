/* eslint-disable prettier/prettier */
import { MinLength } from 'class-validator';
import { UserMessagesHelper } from '../helpers/messages.helper';
import { PermissionsMessagesHelper } from 'src/permissions/helpers/messages.helper';
import { FranchiseMessagesHelper } from 'src/franchise/helpers/messages.helper';

export class UpdateUserAdmDto {

    @MinLength(2, { message: UserMessagesHelper.REGISTER_NAME_NOT_FOUND })
    name: string;

    @MinLength(4, { message: PermissionsMessagesHelper.PERMISSION_NOT_FOUND })
    permissions: string;

    @MinLength(3, { message: FranchiseMessagesHelper.REGISTER_FRANCHISE_NOT_FOUND })
    franchise: string;
}
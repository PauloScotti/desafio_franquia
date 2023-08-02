/* eslint-disable prettier/prettier */
import { MinLength } from 'class-validator';
import { UserMessagesHelper } from '../helpers/messages.helper';

export class UpdateUserDto {

    @MinLength(2, { message: UserMessagesHelper.REGISTER_NAME_NOT_FOUND })
    name?: string;
}
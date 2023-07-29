/* eslint-disable prettier/prettier */
import { MinLength } from 'class-validator';
import { FranchiseMessagesHelper } from '../helpers/messages.helper';

export class FranchiseDto {

    @MinLength(4, { message: FranchiseMessagesHelper.REGISTER_FRANCHISE_NOT_FOUND })
    franchise: string;
}
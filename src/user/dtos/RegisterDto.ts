/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { UserMessagesHelper } from '../helpers/messages.helper';
import { PermissionsMessagesHelper } from 'src/permissions/helpers/messages.helper';
import { FranchiseMessagesHelper } from 'src/franchise/helpers/messages.helper';

export class RegisterDto {

    @MinLength(4, { message: UserMessagesHelper.AUTH_LOGIN_NOT_FOUND })
    @MaxLength(20, { message: UserMessagesHelper.AUTH_LOGIN_NOT_FOUND, })
    login: string;

    @IsEmail({}, { message: UserMessagesHelper.AUTH_EMAIL_NOT_FOUND })
    email: string;

    @IsNotEmpty({ message: UserMessagesHelper.AUTH_PASSWORD_NOT_FOUND })
    @MinLength(4, { message: UserMessagesHelper.REGISTER_STRONG_PASSWORD })
    @MaxLength(20, { message: UserMessagesHelper.REGISTER_STRONG_PASSWORD, })
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: UserMessagesHelper.REGISTER_STRONG_PASSWORD,
    })
    password: string;

    @MinLength(2, { message: UserMessagesHelper.REGISTER_NAME_NOT_FOUND })
    name: string;

    @MinLength(4, { message: PermissionsMessagesHelper.PERMISSION_NOT_FOUND })
    permissions: string;

    @MinLength(3, { message: FranchiseMessagesHelper.REGISTER_FRANCHISE_NOT_FOUND })
    franchise: string;
}
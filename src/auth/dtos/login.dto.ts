/* eslint-disable prettier/prettier */
import { MinLength, MaxLength, IsNotEmpty } from "class-validator";
import { MessagesHelper } from "../helpers/messages.helper";

export class LoginDto {
    @MinLength(4, { message: MessagesHelper.AUTH_LOGIN_NOT_FOUND })
    @MaxLength(20, { message: MessagesHelper.AUTH_LOGIN_NOT_FOUND, })
    login: string;

    @IsNotEmpty({ message: MessagesHelper.AUTH_PASSWORD_NOT_FOUND })
    password: string;
}
import { IsEmail, MaxLength, MinLength } from "class-validator";

export class UserCreateEntity{
    @MinLength(3)
    @MaxLength(10)
    public login: string;

    @IsEmail()
    public email: string;

    @MinLength(6)
    @MaxLength(20)
    public password: string;
}
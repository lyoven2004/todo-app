import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { EphemeralKeyInfo } from 'tls'

export class CreateUserDto {

    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @MinLength(8)
    password: string;
}
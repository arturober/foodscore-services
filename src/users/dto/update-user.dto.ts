import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    readonly email: string;
}
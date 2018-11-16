import { IsString, IsEmail, IsBase64, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import * as crypto from 'crypto';
import { IsUserAlreadyExist } from '../validators/user-exists.validator';

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsEmail()
    @IsUserAlreadyExist({message: 'Email $value is already present in the database'})
    readonly email: string;

    @IsString()
    @Transform((p, o, t) => p ? crypto.createHash('sha256').update(p).digest('base64') : null)
    password: string;

    @IsString()
    @IsNotEmpty()
    avatar: string;

    @IsOptional()
    @IsNumber()
    readonly lat: number;

    @IsOptional()
    @IsNumber()
    readonly lng: number;
}
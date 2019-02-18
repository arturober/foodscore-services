import { IsEmail, IsString, IsNumber, IsOptional } from 'class-validator';
import * as crypto from 'crypto';
import { Transform } from 'class-transformer';

export class LoginUserDto {
    @IsEmail()
    readonly email: string;

    @IsString()
    @Transform(p => crypto.createHash('sha256').update(p).digest('base64'))
    readonly password: string;

    @IsNumber()
    @IsOptional()
    readonly lat;

    @IsNumber()
    @IsOptional()
    readonly lng;

    @IsString()
    @IsOptional()
    readonly oneSignalId: string;
}
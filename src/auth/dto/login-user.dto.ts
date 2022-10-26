import {
  IsEmail,
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Length,
} from 'class-validator';
import * as crypto from 'crypto';
import { Transform } from 'class-transformer';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Transform((p) =>
    crypto.createHash('sha256').update(p.value, 'utf-8').digest('base64')
  )
  readonly password: string;

  @IsString()
  @IsOptional()
  readonly firebaseToken: string;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;
}

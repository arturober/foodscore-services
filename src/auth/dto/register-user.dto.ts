import {
  IsString,
  IsEmail,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as crypto from 'crypto';
import { IsUserAlreadyExist } from '../validators/user-exists.validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsUserAlreadyExist({
    message: 'Email $value is already present in the database',
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Transform((p) =>
    p.value
      ? crypto.createHash('sha256').update(p.value, 'utf-8').digest('base64')
      : '',
  )
  password: string;

  @IsString()
  @IsNotEmpty()
  @Transform((p) => (p.value.startsWith('http') ? '' : p.value))
  avatar: string;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;
}

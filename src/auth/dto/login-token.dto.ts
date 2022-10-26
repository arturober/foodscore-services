import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class LoginTokenDto {
  @IsString()
  @IsNotEmpty()
  readonly token: string;

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

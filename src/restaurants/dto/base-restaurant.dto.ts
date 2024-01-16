import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  Length,
  IsBase64,
  MinLength,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class BaseRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @Transform((v) => (typeof v.value === 'string' ? v.value.trim() : v))
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform((v) => (typeof v.value === 'string' ? v.value.trim() : v))
  description: string;

  @IsArray()
  @IsNotEmpty()
  daysOpen: string[];

  @IsString()
  @IsNotEmpty()
  @Length(9, 9)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Transform((v) => (typeof v.value === 'string' ? v.value.trim() : v))
  cuisine: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  address: string;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsOptional()
  stars: number;
}

import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBase64,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRestaurantDto {
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
  @IsBase64()
  @Transform((v) =>
    typeof v.value === 'string' ? v.value.split(',')[1] || v.value : v.value,
  )
  image: string;

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

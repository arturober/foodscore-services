import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @Transform((v) => v.value.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @Transform((v) => v.value.trim())
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
  image: string;

  @IsString()
  @IsNotEmpty()
  @Transform((v) => v.value.trim())
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

  @IsEmpty()
  stars: number;
}

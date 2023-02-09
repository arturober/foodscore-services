import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseRestaurantDto } from './base-restaurant.dto';

export class UpdateRestaurantDto extends BaseRestaurantDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Transform((v) =>
    typeof v.value === 'string' ? v.value.split(',')[1] || v.value : v.value,
  )
  image: string;
}

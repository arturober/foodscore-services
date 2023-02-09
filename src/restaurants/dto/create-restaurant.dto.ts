import { Transform } from 'class-transformer';
import { IsBase64, IsNotEmpty, IsString } from 'class-validator';
import { BaseRestaurantDto } from './base-restaurant.dto';

export class CreateRestaurantDto extends BaseRestaurantDto {
  @IsString()
  @IsNotEmpty()
  @IsBase64()
  @Transform((v) =>
    typeof v.value === 'string' ? v.value.split(',')[1] || v.value : v.value,
  )
  image: string;
}

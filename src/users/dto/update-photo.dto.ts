import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsBase64 } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  @IsNotEmpty()
  @IsBase64()
  @Transform((v) =>
    typeof v.value === 'string' ? v.value.split(',')[1] || v.value : v.value,
  )
  avatar: string;
}

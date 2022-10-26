import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePhotoDto {
  @IsString()
  @IsNotEmpty()
  avatar: string;
}

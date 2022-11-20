import { IsInt, IsString, Min, Max, IsNotEmpty } from 'class-validator';

export class InsertCommentDto {
  @IsInt()
  @Min(1)
  @Max(5)
  readonly stars: number;

  @IsString()
  @IsNotEmpty()
  readonly text: string;
}

import { IsNumber, IsInt, IsString, Min, Max } from 'class-validator';

export class InsertCommentDto {
  @IsInt()
  @Min(1)
  @Max(5)
  readonly stars: number;

  @IsString()
  readonly text: string;
}

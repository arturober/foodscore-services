import { IsNumber, IsOptional } from "class-validator";
import { CreateRestaurantDto } from "./create-restaurant.dto";

export class UpdateRestaurantDto extends CreateRestaurantDto {
    @IsNumber()
    @IsOptional()
    id?: number;
}
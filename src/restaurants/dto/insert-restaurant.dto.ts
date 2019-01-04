import { IsString, IsDateString, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class InsertRestaurantDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsArray()
    readonly daysOpen: string[];

    @IsString()
    readonly phone: string;

    @IsString()
    image: string;

    @Transform((value, o, t) => typeof value === 'string' ? value.split(',') : value)
    @IsArray()
    cuisine: string[];

    @IsString()
    readonly address: string;

    @IsNumber()
    readonly lat: number;

    @IsNumber()
    readonly lng: number;

    creator = null;
}
import { IsString, IsDateString, IsOptional, ValidateNested, IsArray, IsNumber, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class InsertRestaurantDto {
    @IsString()
    @MinLength(1)
    readonly name: string;

    @IsString()
    @MinLength(1)
    readonly description: string;

    @IsArray()
    readonly daysOpen: string[];

    @IsString()
    @MinLength(9)
    readonly phone: string;

    @IsString()
    @MinLength(1)
    image: string;

    @Transform((value, o, t) => typeof value === 'string' ? value.split(',') : value)
    @IsArray()
    cuisine: string[];

    @IsString()
    @MinLength(1)
    readonly address: string;

    @IsNumber()
    readonly lat: number;

    @IsNumber()
    readonly lng: number;

    creator = null;
}
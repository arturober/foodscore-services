import { IsString, IsDateString, IsOptional, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { User } from 'entities/user.entity';
import { Transform } from 'class-transformer';
import { Req, Inject } from '@nestjs/common';
import { Request } from 'express';
import { ContextCreator } from '@nestjs/core/helpers/context-creator';

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
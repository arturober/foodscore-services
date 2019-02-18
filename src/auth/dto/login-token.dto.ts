import { IsString, IsNumber, IsOptional } from 'class-validator';

export class LoginTokenDto {
    @IsString()
    readonly token: string;

    @IsNumber()
    @IsOptional()
    readonly lat;

    @IsNumber()
    @IsOptional()
    readonly lng;

    @IsString()
    @IsOptional()
    readonly oneSignalId: string;
}
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateSupportDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    qualification?: string;

    @IsString()
    @IsOptional()
    experience?: string;

    @IsString()
    @IsOptional()
    imageId?: string;
}
import { IsString, IsOptional, IsEmail, IsArray } from 'class-validator';

export class CreateInstructorDto {
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

    @IsArray()
    @IsOptional()
    subjects?: string[];  // Subject IDs

    @IsArray()
    @IsOptional()
    departments?: string[]; // Department IDs

    @IsString()
    @IsOptional()
    imageId?: string;
}

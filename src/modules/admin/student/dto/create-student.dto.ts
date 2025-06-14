import { IsString, IsOptional, IsEmail, IsEnum } from 'class-validator';
import { RoleEnum } from '@prisma/client';

export class CreateStudentDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsOptional()
    imageId?: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;

    @IsString()
    @IsOptional()
    class?: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    parentId?: string;
}

import { IsEmail, IsString } from 'class-validator';

export class SupportLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}
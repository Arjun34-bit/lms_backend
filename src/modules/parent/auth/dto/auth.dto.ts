import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray, IsOptional } from 'class-validator';

export class ParentSignupDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    address?: string;
}

export class ParentSigninDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ConnectChildrenDto {
    @IsArray()
    @IsNotEmpty({ each: true })
    studentIds: string[];
}

export class DisconnectChildrenDto {
    @IsArray()
    @IsNotEmpty({ each: true })
    studentIds: string[];
}

export class LoginWithPhoneNumberDto {
    @IsNotEmpty()
    @IsString()
    idToken: string;
}

export class UpdateParentProfileDto {
    @IsOptional()
    @IsString()
    @MinLength(2)
    name?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    currentPassword?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    newPassword?: string;

    @IsOptional()
    @IsString()
    address?: string;
}

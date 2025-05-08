import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray } from 'class-validator';

export class ParentSignupDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsString()
    address?: string;
}

export class ParentSigninDto {
    @IsEmail()
    email: string;

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
    @IsString()
    @IsNotEmpty()
    idToken: string;
  }

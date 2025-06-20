import { IsEmail, IsNotEmpty, IsString, MinLength, IsArray } from 'class-validator';
import { IsOptional } from 'class-validator';

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
    token: string;
  }
  export class LoginWithGoogleDto {
  idToken: string;
}
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;
  
@IsOptional()
@IsEmail({}, { message: 'Email must be a valid email address' })
email?: string;


  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}





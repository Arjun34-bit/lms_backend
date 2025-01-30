import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsMongoId()
  @IsOptional()
  departmentId: string;
}

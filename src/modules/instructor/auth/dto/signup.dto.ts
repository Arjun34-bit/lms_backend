import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsPhoneNumber('IN') // Optional but specific
  @IsNotEmpty()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone number must be a valid Indian number starting with +91',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsMongoId()
  @IsOptional()
  departmentId: string;
}

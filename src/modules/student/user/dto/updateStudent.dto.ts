import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsPhoneNumber,
} from 'class-validator';

export class StudentProfileUpdateDto {
  @IsString()
  @Length(2, 50)
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsPhoneNumber(null)
  @IsOptional()
  phoneNumber?: string;
}

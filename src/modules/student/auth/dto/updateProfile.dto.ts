import { IsOptional, IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  // Add other fields that can be updated, for example:
  // @IsOptional()
  // @IsString()
  // phoneNumber?: string;

  // @IsOptional()
  // @IsString()
  // address?: string;
}
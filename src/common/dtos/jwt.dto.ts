import { RoleEnum } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class JwtDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(RoleEnum)
  role: RoleEnum;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}

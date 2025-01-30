import { CourseLevelEnum } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsEnum(CourseLevelEnum)
  @IsNotEmpty()
  level: CourseLevelEnum;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  categoryId: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsMongoId()
  @IsNotEmpty()
  departmentId: string;

  @IsMongoId()
  @IsNotEmpty()
  subjectId: string;

  @IsMongoId()
  @IsNotEmpty()
  languageId: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

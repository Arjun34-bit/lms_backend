import { Transform } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ScheduleLiveClassDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}

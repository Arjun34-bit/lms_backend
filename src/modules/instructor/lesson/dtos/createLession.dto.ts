import { CourseLevelEnum } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class CreateLessionDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  lectureName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  videos: string;
}

export class VideoMetaDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;
}

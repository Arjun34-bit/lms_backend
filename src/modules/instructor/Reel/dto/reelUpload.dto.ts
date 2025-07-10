import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReelDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  courseLessionId?: string;
}

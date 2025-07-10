import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VideoTypeEnum } from '@prisma/client';

export class CreateReelDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  type?: VideoTypeEnum | 'REEL';

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  courseLessionId?: string;
}

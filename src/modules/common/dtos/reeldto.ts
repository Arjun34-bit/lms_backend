import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class ReelUploadDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  courseId: string;

  @IsMongoId()
  courseLessionId: string;

  @IsMongoId()
  @IsOptional()
  fileId?: string;
}

import { IsMongoId, IsOptional } from 'class-validator';

export class CourseFilterDto {
  @IsMongoId()
  @IsOptional()
  departmentId?: string;

  @IsMongoId()
  @IsOptional()
  subjectId?: string;

  @IsMongoId()
  @IsOptional()
  languageId?: string;

  @IsMongoId()
  @IsOptional()
  categoryId?: string;
}

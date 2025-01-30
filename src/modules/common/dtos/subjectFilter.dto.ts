import { IsMongoId, IsOptional } from 'class-validator';

export class SubjectFilterDto {
  @IsMongoId()
  @IsOptional()
  departmentId: string;
}

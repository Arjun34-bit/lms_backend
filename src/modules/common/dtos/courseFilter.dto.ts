import { AdminApprovalEnum } from '@prisma/client';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class CourseFilterDto extends PaginationDto {
  @IsMongoId()
  @IsOptional()
  departmentId?: string;

  @IsOptional()
  @IsEnum(AdminApprovalEnum)
  approvalStatus: AdminApprovalEnum;

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

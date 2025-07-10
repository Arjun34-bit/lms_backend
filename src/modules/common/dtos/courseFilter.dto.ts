import { AdminApprovalEnum } from '@prisma/client';
import { IsEnum, IsMongoId, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer'; // ✅ important
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class CourseFilterDto extends PaginationDto {
  @IsString()
  @IsOptional()
  instructorName?: string;

  @IsString()
  @IsOptional()
  courseName?: string;

  @IsOptional()
  @Type(() => Number) // ✅ convert query param string to number
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number) // ✅ convert query param string to number
  @IsNumber()
  @Min(0)
  maxPrice?: number;

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

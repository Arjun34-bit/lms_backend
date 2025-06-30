import { AdminApprovalEnum } from '@prisma/client';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class CourseApprovalDto {
  @IsNotEmpty()
  @IsMongoId()
  courseId: string;

  @IsNotEmpty()
  @IsEnum(AdminApprovalEnum)
  approvalStatus: AdminApprovalEnum;
}
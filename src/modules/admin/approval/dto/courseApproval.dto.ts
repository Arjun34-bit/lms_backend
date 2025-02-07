import { AdminApprovalEnum } from '@prisma/client';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class CourseApprovalDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsEnum(AdminApprovalEnum)
  @IsNotEmpty()
  approvalStatus: AdminApprovalEnum;
}

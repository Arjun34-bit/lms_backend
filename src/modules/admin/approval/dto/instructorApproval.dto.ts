import { AdminApprovalEnum } from '@prisma/client';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';

export class InstructorApprovalDto {
  @IsMongoId()
  @IsNotEmpty()
  instructorId: string;

  @IsEnum(AdminApprovalEnum)
  @IsNotEmpty()
  approvalStatus: AdminApprovalEnum;
}

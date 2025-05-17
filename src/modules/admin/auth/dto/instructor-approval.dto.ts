import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { AdminApprovalEnum } from '@prisma/client';

export class InstructorApprovalDto {
  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @IsEnum(AdminApprovalEnum)
  @IsNotEmpty()
  approvalStatus: AdminApprovalEnum;
}
import { AdminApprovalEnum } from '@prisma/client';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class FileLinkDto {
  @IsMongoId()
  @IsOptional()
  fileId: string;
}

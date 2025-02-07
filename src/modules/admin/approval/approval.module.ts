import { Module } from '@nestjs/common';
import { AdminApprovalController } from './controllers/approval.controller';
import { ApprovalService } from './services/approval.service';

@Module({
  imports: [],
  controllers: [AdminApprovalController],
  providers: [ApprovalService],
})
export class AdminApprovalModule {}

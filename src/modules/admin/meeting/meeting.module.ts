import { Module } from '@nestjs/common';
import { MeetingController } from './meeting.controller';
import { MeetingService } from './meeting.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ApiUtilsService } from '@utils/utils.service';

@Module({
  imports: [PrismaModule],
  controllers: [MeetingController],
  providers: [MeetingService, ApiUtilsService],
  exports: [MeetingService]
})
export class MeetingModule {}
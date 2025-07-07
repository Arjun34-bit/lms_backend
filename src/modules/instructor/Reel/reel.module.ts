import { Module } from '@nestjs/common';
import { ReelController } from './controller/reel.controller';
import { ReelService } from './service/reel.service';

@Module({
  imports: [],
  controllers: [ReelController],
  providers: [ReelService],
})
export class CourseModule {}

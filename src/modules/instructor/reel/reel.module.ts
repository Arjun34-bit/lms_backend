import { Module } from '@nestjs/common';
import { ReelController } from './controller/reel.controller';
import { ReelService } from './service/reel.service';

@Module({
  imports: [],
  controllers: [ReelController],
  exports:[ReelService],
  providers: [ReelService],
})
export class ReelModule {}

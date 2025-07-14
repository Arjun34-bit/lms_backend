import { Module } from '@nestjs/common';
import { MediasoupService } from './mediasoup.service';
import { MediasoupGateway } from './mediasoup.gateway';
import { ReelModule } from '../reel/reel.module';

@Module({
  imports:[ReelModule],
  providers: [MediasoupService, MediasoupGateway],
  exports: [MediasoupService],
})
export class MediasoupModule {}
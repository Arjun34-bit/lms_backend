import { Module } from '@nestjs/common';
import { WebrtcGateway } from './webrtc.gateway';

@Module({
  imports: [],
  controllers: [],
  providers: [WebrtcGateway],
})
export class WebSocketModule {}

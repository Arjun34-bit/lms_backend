import { Module } from '@nestjs/common';
import { WebrtcGateway } from './webrtc.gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EmailModule } from '@modules/common/email/email.module';

@Module({
  imports: [PrismaModule,EmailModule],
  controllers: [],
  providers: [WebrtcGateway],
})
export class WebSocketModule {}

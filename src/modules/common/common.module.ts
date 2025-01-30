import { Global, Module } from '@nestjs/common';
import { CommonController } from './controllers/common.controller';
import { CommonService } from './services/common.service';

@Global()
@Module({
  imports: [],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

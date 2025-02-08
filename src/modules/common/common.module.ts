import { Global, Module } from '@nestjs/common';
import { CommonController } from './controllers/common.controller';
import { CommonService } from './services/common.service';
import { MinioService } from './services/minio.service';

@Global()
@Module({
  imports: [],
  controllers: [CommonController],
  providers: [CommonService, MinioService],
  exports: [CommonService, MinioService],
})
export class CommonModule {}

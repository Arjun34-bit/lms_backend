import { Global, Module } from '@nestjs/common';
import { ApiUtilsService } from './utils.service';

@Global()
@Module({
  providers: [ApiUtilsService],
  exports: [ApiUtilsService],
})
export class ApiUtilsModule {}

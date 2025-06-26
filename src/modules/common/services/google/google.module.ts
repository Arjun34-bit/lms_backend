// src/modules/common/services/google/google.module.ts
import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';

@Module({
  providers: [GoogleService],
  exports: [GoogleService], // ✅ Important to export
})
export class GoogleModule {}

import { Module } from '@nestjs/common';
import { LessionService } from './services/lession.service';
import { LessionController } from './controllers/lession.controller';

@Module({
  imports: [],
  controllers: [LessionController],
  providers: [LessionService],
})
export class LessonModule {}

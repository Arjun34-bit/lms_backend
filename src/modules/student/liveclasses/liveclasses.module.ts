import { Module } from '@nestjs/common';
import { LiveClassesController } from './controllers/liveclasses.controller';
import { LiveClassesService } from './services/liveclasses.service';

@Module({
  imports: [],
  controllers: [LiveClassesController],
  providers: [LiveClassesService],
})
export class LiveClassesModule {}

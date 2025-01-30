import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';

@Module({
  imports: [],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}

import { Module } from '@nestjs/common';
import { CourseController } from './controllers/course.controller';
import { CourseService } from './services/course.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioService } from '@modules/common/services/minio.service';
import { ApiUtilsService } from '@utils/utils.service';

@Module({
  imports: [PrismaModule],
  controllers: [CourseController],
  providers: [CourseService, MinioService, ApiUtilsService],
})
export class CourseModule {}
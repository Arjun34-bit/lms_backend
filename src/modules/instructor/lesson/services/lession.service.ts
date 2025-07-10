import { MinioService } from '@modules/common/services/minio.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessionDto } from '../dtos/createLession.dto';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { Multer } from 'multer';
import { envConstant } from '@constants/index';
import { VideoTypeEnum } from '@prisma/client';

@Injectable()
export class LessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async createLession(
    createLessionDto: CreateLessionDto,
    user: InstructorJwtDto,
    files: Multer.File[],
  ) {
    try {
      const { courseId, lectureName, description } = createLessionDto;

      const videos = JSON.parse(createLessionDto.videos);

      if (!courseId) throw new BadRequestException('Course ID is required');
      if (!files || !videos || videos.length === 0 || files.length === 0) {
        throw new BadRequestException('At least one video is required');
      }

      const courseExists = await this.prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true },
      });
      if (!courseExists) throw new BadRequestException('Course not found');

      const uploadedFiles = await Promise.all(
        files.map((file) =>
          this.minioService.uploadFileStream(
            envConstant.PUBLIC_BUCKET_NAME,
            file.buffer,
            `course_lessions/${Date.now()}-${file.originalname}`,
          ),
        ),
      );

      const lesson = await this.prisma.courseLession.create({
        data: { courseId, lectureName, description },
      });

      const videoRecords = await Promise.all(
        uploadedFiles.map((uploaded, index) => {
          const meta = videos[index];
          if (!uploaded?.fileData?.id) {
            throw new BadRequestException('Video upload failed');
          }

          return this.prisma.videos.create({
            data: {
              title: meta.title,
              description: meta.description,
              type: VideoTypeEnum.LECTURE || 'LECTURE',
              courseId,
              courseLessionId: lesson.id,
              fileId: uploaded.fileData.id,
            },
          });
        }),
      );

      return {
        message: 'Lesson created with videos',
        lesson,
        videos: videoRecords,
      };
    } catch (error) {
      Logger.error(error?.stack || error.message);
      throw error;
    }
  }
}

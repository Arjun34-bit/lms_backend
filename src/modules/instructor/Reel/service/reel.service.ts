import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinioService } from '../../../common/services/minio.service';
import { envConstant } from '@constants/index';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { CreateReelDto } from '../dto/reelUpload.dto';
import { Multer } from 'multer';
import { VideoTypeEnum } from '@prisma/client';

@Injectable()
export class ReelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async uploadReel(
    dto: CreateReelDto,
    user: InstructorJwtDto,
    file: Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('File not uploaded');
      }

      const objectKey = `reels/${Date.now()}_${file.originalname}`;

      const uploaded = await this.minioService.uploadFileStream(
        envConstant.PUBLIC_BUCKET_NAME,
        file.buffer,
        objectKey,
      );

      const reel = await this.prisma.videos.create({
        data: {
          title: dto.title,
          description: dto.description,
          type: VideoTypeEnum.REEL || 'REEL',
          courseId: dto.courseId,
          courseLessionId: dto.courseLessionId,
          fileId: uploaded.fileData.id,
        },
      });

      return reel;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getAllReel(user: InstructorJwtDto) {
    try {
      const reels = await this.prisma.videos.findMany({
        where: {
          type: VideoTypeEnum.REEL,
        },
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
          file: {
            select: {
              bucketName: true,
              objectKey: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const enriched = await Promise.all(
        reels.map(async (reel) => {
          const fileUrl = await this.minioService.getFileUrl(
            reel.file.bucketName,
            reel.file.objectKey,
          );

          return {
            id: reel.id,
            title: reel.title,
            description: reel.description,
            fileUrl,
            uploadedAt: reel.created_at,
          };
        }),
      );

      return enriched;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}

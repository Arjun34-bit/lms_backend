import { envConstant } from '@constants/index';
import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PaymentStatusEnum, VideoTypeEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinioService } from '../../../common/services/minio.service';

@Injectable()
export class EnrolledCourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async getEnrolledCourses(user: StudentJwtDto) {
    try {
      const enrolledCourse = await this.prisma.studentCourseEnrolled.findMany({
        where: {
          studentId: user?.studentId,
          courseBuy: {
            status: PaymentStatusEnum.COMPLETED,
          },
        },
        select: {
          id: true,
          courseId: true,
          created_at: true,
          course: {
            select: {
              id: true,
              title: true,
              level: true,
              description: true,
              categoryId: true,
              startDate: true,
              endDate: true,
              departmentId: true,
              subjectId: true,
              languageId: true,
              price: true,
              thumbnailId: true,
              addedById: true,
              approvalStatus: true,
              created_at: true,
              updated_at: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const enriched = await Promise.all(
        enrolledCourse.map(async ({ course, ...rest }) => {
          let thumbnailUrl: string | null = null;

          if (course?.thumbnailId) {
            const fileRecord = await this.prisma.files.findUnique({
              where: { id: course.thumbnailId },
              select: { objectKey: true },
            });

            if (fileRecord?.objectKey) {
              thumbnailUrl = await this.minioService.getFileUrl(
                envConstant.PUBLIC_BUCKET_NAME,
                fileRecord.objectKey,
              );
            }
          }

          return {
            ...rest,
            course: {
              ...course,
              thumbnailUrl,
            },
          };
        }),
      );

      return {
        enrolledCourse: enriched,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getSingleCourse(user: StudentJwtDto, courseId: string) {
    try {
      const enrolledCourse = await this.prisma.studentCourseEnrolled.findFirst({
        where: {
          studentId: user?.userId,
          id: courseId,
          courseBuy: {
            status: PaymentStatusEnum.COMPLETED,
          },
        },
        select: {
          id: true,
          created_at: true,
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailId: true,
              addedById: true,
              approvalStatus: true,
              created_at: true,
              updated_at: true,
              CourseLession: {
                select: {
                  id: true,
                  lectureName: true,
                  description: true,
                  created_at: true,
                  Videos: {
                    where: {
                      type: VideoTypeEnum.LECTURE || 'LECTURE',
                    },
                    select: {
                      id: true,
                      title: true,
                      description: true,
                      type: true,
                      fileId: true,
                      created_at: true,
                      updated_at: true,
                      file: {
                        select: {
                          objectKey: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!enrolledCourse) {
        throw new Error('Course not found or not enrolled');
      }

      const course = enrolledCourse.course;

      let thumbnailUrl: string | null = null;
      if (course?.thumbnailId) {
        const fileRecord = await this.prisma.files.findUnique({
          where: { id: course.thumbnailId },
          select: { objectKey: true },
        });
        if (fileRecord?.objectKey) {
          thumbnailUrl = await this.minioService.getFileUrl(
            envConstant.PUBLIC_BUCKET_NAME,
            fileRecord.objectKey,
          );
        }
      }

      const lessons = await Promise.all(
        course.CourseLession.map(async (lesson) => {
          const videos = await Promise.all(
            lesson.Videos.map(async (video) => {
              let videoUrl: string | null = null;

              if (video?.file?.objectKey) {
                videoUrl = await this.minioService.getFileUrl(
                  envConstant.PUBLIC_BUCKET_NAME,
                  video.file.objectKey,
                );
              }

              return {
                ...video,
                videoUrl,
              };
            }),
          );

          return {
            Videos: videos,
          };
        }),
      );

      return {
        // ...enrolledCourse,
        course: {
          id: course.id,
          title: course.title,
          description: course.description,
          thumbnailUrl,
          lessons,
        },
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}

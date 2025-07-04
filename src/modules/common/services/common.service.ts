import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubjectFilterDto } from '../dtos/subjectFilter.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CourseFilterDto } from '../dtos/courseFilter.dto';
import { AdminApprovalEnum } from '@prisma/client';
import { ResendEmailVerificationLinkDto } from '../dtos/resendVerificationLink.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { firebaseAuth } from 'src/config/firebase.config';
import { FileLinkDto } from '../dtos/fileLink.dto';
import { MinioService } from './minio.service';
 import { envConstant } from '@constants/index';

@Injectable()
export class CommonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getLanguages() {
    try {
      const languages = await this.prisma.language.findMany({
        where: {},
      });
      return languages;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getDepartments() {
    try {
      const departments = await this.prisma.department.findMany({
        where: {},
      });
      return departments;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getSubjects(queryDto: SubjectFilterDto) {
    try {
      const subjects = await this.prisma.subject.findMany({
        where: {
          ...queryDto,
        },
        include: {
          department: true,
        },
      });
      return subjects;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getCategories() {
    try {
      const categories = await this.prisma.category.findMany({
        where: {},
      });
      return categories;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getCourses(queryDto: PaginationDto, filterDto: CourseFilterDto) {
    try {
      if (!queryDto.limit) {
        queryDto.limit = 10;
      }
      if (!queryDto.pageNumber) {
        queryDto.pageNumber = 1;
      }
 
      const courses = await this.prisma.course.findMany({
        where: {
          approvalStatus: AdminApprovalEnum.approved,
           AND: [
            filterDto.categoryId ? { categoryId: filterDto.categoryId } : {},
            filterDto.languageId ? { languageId: filterDto.languageId } : {},
            filterDto.departmentId ? { departmentId: filterDto.departmentId } : {},
            filterDto.subjectId ? { subjectId: filterDto.subjectId } : {},
            filterDto.courseName ? { title: { contains: filterDto.courseName, mode: 'insensitive' } } : {},
            filterDto.minPrice ? { price: { gte: filterDto.minPrice } } : {},
            filterDto.maxPrice ? { price: { lte: filterDto.maxPrice } } : {},
            filterDto.instructorName ? {
              // instructor: {
              //   user: {
              //     name: { contains: filterDto.instructorName, mode: 'insensitive' }
              //   }
              // }
            } : {},
          ],
        },
        // include: {
        //   instructor: {
        //     include: {
        //       user: true
        //     }
        //   }
        // },
        orderBy: {
          created_at: 'desc',
        },
        skip: Number(queryDto.limit) * (Number(queryDto.pageNumber) - 1),
        take: Number(queryDto.limit),
      });

      const totalCount = await this.prisma.course.count({
        where: {
          approvalStatus: AdminApprovalEnum.approved,
          AND: [
            filterDto.categoryId ? { categoryId: filterDto.categoryId } : {},
            filterDto.languageId ? { languageId: filterDto.languageId } : {},
            filterDto.departmentId ? { departmentId: filterDto.departmentId } : {},
            filterDto.subjectId ? { subjectId: filterDto.subjectId } : {},
            filterDto.courseName ? { title: { contains: filterDto.courseName, mode: 'insensitive' } } : {},
            filterDto.minPrice ? { price: { gte: filterDto.minPrice } } : {},
            filterDto.maxPrice ? { price: { lte: filterDto.maxPrice } } : {},
            filterDto.instructorName ? {
              // instructor: {
              //   user: {
              //     name: { contains: filterDto.instructorName, mode: 'insensitive' }
              //   }
              // }
            } : {},
          ],
        },
      });

       const enriched = await Promise.all(
        courses.map(async ({ thumbnailId, ...rest }) => {
          let thumbnailUrl = null;
          if (thumbnailId) {
            const fileRecord = await this.prisma.files.findUnique({
              where: { id: thumbnailId },
              select: { objectKey: true },
            });
            if (fileRecord && fileRecord.objectKey) {
              thumbnailUrl = await this.minioService.getFileUrl(
                envConstant.PUBLIC_BUCKET_NAME,
                fileRecord.objectKey,
              );
            }
          }
          return {
            ...rest,
            thumbnailUrl,
          };
        }),
      );

      return {
        courses: enriched,
        totalCount,
        limit: queryDto.limit,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getCoursesDetails(filterDto: CourseFilterDto, courseId: string) {
    try {
      const course = await this.prisma.course.findFirst({
        where: {
          id: courseId,
          approvalStatus: AdminApprovalEnum.approved,
          categoryId: filterDto.categoryId,
          departmentId: filterDto.departmentId,
          languageId: filterDto.languageId,
          subjectId: filterDto.subjectId,
        },
        include: {
          category: true,
          department: true,
          language: true,
          subject: true,
        },
      });

      return {
        course,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getCourseByCategory(queryDto: PaginationDto, categoryId: string) {
    try {
      if (!queryDto.limit) {
        queryDto.limit = 10;
      }
      if (!queryDto.pageNumber) {
        queryDto.pageNumber = 1;
      }

      const courses = this.prisma.course.findMany({
        where: {
          categoryId: categoryId,
          approvalStatus: AdminApprovalEnum.approved,
        },
        include: {
          department: true,
          subject: true,
          language: true,
          category: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: Number(queryDto.limit) * (Number(queryDto.pageNumber) - 1),
        take: Number(queryDto.limit),
      });

      const totalCount = await this.prisma.course.count({
        where: {
          categoryId: categoryId,
          approvalStatus: AdminApprovalEnum.approved,
        },
      });

      return {
        courses,
        totalCount,
        limit: queryDto.limit,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getRoleAndUserDataByUserId(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          firebaseUid: true,
          verified: true,
          admin: true,
          instructor: true,
          student: true,
        },
      });

      return user;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async resendEmailVerificationLink(dto: ResendEmailVerificationLinkDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email.toLowerCase(),
        },
        select: {
          email: true,
          role: true,
          verified: true,
        },
      });

      if (!user) {
        throw new BadRequestException("User doesn't exists");
      }

      const existingUserInFirebase = await firebaseAuth
        .getUserByEmail(dto.email.toLowerCase())
        .then((user) => user)
        .catch((error) =>
          error.code === 'auth/user-not-found'
            ? null
            : Promise.reject(
                new BadRequestException('Firebase error: ' + error.message),
              ),
        );

      if (user.verified && existingUserInFirebase?.emailVerified) {
        throw new BadRequestException('User email is already verified');
      }

      this.eventEmitter.emit('user.sendVerificationLink', {
        email: user.email,
        role: user.role,
      });
      return null;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getFileStream(dto: FileLinkDto) {
    try {
      const fileData = await this.prisma.files.findUnique({
        where: {
          id: dto.fileId,
        },
      });

      if (!fileData) {
        throw new BadRequestException('File not found');
      }

      const stream = await this.minioService.getFileStream(
        fileData.bucketName,
        fileData.objectKey,
      );

      return stream;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getCourseById(courseId: string) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });
  
      if (!course) {
        throw new BadRequestException('Course not found');
      }

      let thumbnailUrl = null;
      if (course.thumbnailId) {
        const fileRecord = await this.prisma.files.findUnique({
          where: { id: course.thumbnailId },
          select: { objectKey: true },
        });
        if (fileRecord && fileRecord.objectKey) {
          thumbnailUrl = await this.minioService.getFileUrl(
            envConstant.PUBLIC_BUCKET_NAME,
            fileRecord.objectKey,
          );
        }
      }

      return {
        ...course,
        thumbnailUrl,
      };
    } catch (error) {
      Logger.error(error?.stack || error);
      throw error;
    }
  }
  
}

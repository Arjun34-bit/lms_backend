import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from '../dtos/createCourse.dto';
import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { AdminApprovalEnum } from '@prisma/client';
import { Multer } from 'multer';
import { MinioService } from '@modules/common/services/minio.service';
import { envConstant } from '@constants/index';
import { AdminJwtDto } from '@modules/common/dtos/admindto';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    user: AdminJwtDto,
    file: Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Please upload thumbnail');
      }

      const uploadedFile = await this.minioService.uploadFile(
        envConstant.PUBLIC_BUCKET_NAME,
        file.buffer,
        `course_thumbnails/${Date.now()}-${file.originalname}`,
      );
      
      if (!uploadedFile || !uploadedFile.fileData) {
        throw new BadRequestException('Failed to upload thumbnail');
      }

      const thumbnailId = uploadedFile.fileData.id;

      // Validate category
      const checkCategory = await this.prisma.category.count({
        where: {
          id: createCourseDto.categoryId,
        },
      });
      if (!checkCategory) {
        throw new BadRequestException('Invalid category');
      }

      // Validate subject and department
      const checkSubject = await this.prisma.subject.count({
        where: {
          id: createCourseDto.subjectId,
          departmentId: createCourseDto.departmentId,
        },
      });
      if (!checkSubject) {
        throw new BadRequestException('Invalid department or subject');
      }

      // Validate language
      const checkLanguage = await this.prisma.language.count({
        where: {
          id: createCourseDto.languageId,
        },
      });
      if (!checkLanguage) {
        throw new BadRequestException('Invalid language');
      }

      // Validate instructor only if instructorId is provided
      if (createCourseDto.instructorId) {
        const checkInstructor = await this.prisma.instructor.count({
          where: {
            id: createCourseDto.instructorId,
          },
        });
        if (!checkInstructor) {
          throw new BadRequestException('Invalid instructor');
        }
      }

      // Create course data object
      const courseData: any = {
        ...createCourseDto,
        addedById: user.adminId, // Use adminId instead of userId
        thumbnailId,
        approvalStatus: AdminApprovalEnum.approved, // Auto-approve for admin
      };

      // Add instructor relation only if instructorId is provided
      if (createCourseDto.instructorId) {
        courseData.InstructorAssignedToCourse = {
          create: {
            instructorId: createCourseDto.instructorId,
          },
        };
      }

      // Create course
      const course = await this.prisma.course.create({
        data: courseData,
      });

      return course;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getCourses(queryDto: CourseFilterDto) {
    try {
      const limit = queryDto.limit || 10;
      const pageNumber = queryDto.pageNumber || 1;
      const skip = (pageNumber - 1) * limit;

      const whereClause = {
        AND: [
          queryDto.categoryId ? { categoryId: queryDto.categoryId } : {},
          queryDto.languageId ? { languageId: queryDto.languageId } : {},
          queryDto.departmentId ? { departmentId: queryDto.departmentId } : {},
        ],
      };
      
      const [courses, totalCount] = await Promise.all([
        this.prisma.course.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            category: true,
            department: true,
            subject: true,
            language: true,
            thumbnail: true,
            InstructorAssignedToCourse: {
              include: {
                instructor: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true,
                        phoneNumber: true
                      }
                    }
                  }
                }
              }
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.course.count({
          where: whereClause,
        }),
      ]);

      const enrichedCourses = await Promise.all(
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
        courses: enrichedCourses,
        totalCount,
        limit,
      };
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
        where: {
          id: courseId,
        },
        include: {
          category: true,
          department: true,
          subject: true,
          language: true,
          InstructorAssignedToCourse: {
            include: {
              instructor: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                      phoneNumber: true
                    }
                  }
                }
              }
            }
          },
          thumbnail: true
        }
      });

      if (!course) {
        throw new BadRequestException('Course not found');
      }

      const { thumbnailId, ...rest } = course;
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
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

}
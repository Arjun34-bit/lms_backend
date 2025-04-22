import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from '../dtos/createCourse.dto';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { AdminApprovalEnum } from '@prisma/client';
import { Multer } from 'multer';
import { MinioService } from '@modules/common/services/minio.service';
import { envConstant } from '@constants/index';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minioService: MinioService,
  ) {}

  async createCourse(
    createCourseDto: CreateCourseDto,
    user: InstructorJwtDto,
    file: Multer.File,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Please upload thumbnail');
      }
      const checkCategory = await this.prisma.category.count({
        where: {
          id: createCourseDto.categoryId,
        },
      });
      if (!checkCategory) {
        throw new BadRequestException('Invalid category');
      }

      const checkSubject = await this.prisma.subject.count({
        where: {
          id: createCourseDto.subjectId,
          departmentId: createCourseDto.departmentId,
        },
      });
      if (!checkSubject) {
        throw new BadRequestException('Invalid department or subject');
      }

      const checkLanguage = await this.prisma.language.count({
        where: {
          id: createCourseDto.languageId,
        },
      });
      if (!checkLanguage) {
        throw new BadRequestException('Invalid language');
      }

      const uploadedFile = await this.minioService.uploadFile(
        envConstant.PUBLIC_BUCKET_NAME,
        file?.buffer,
        `course_thumbnails/${Date.now()}-${file.originalname}`,
      );
if (!uploadedFile) {
        throw new BadRequestException('Failed to upload thumbnail');
      }
      const course = await this.prisma.course.create({
        data: {
          ...createCourseDto,
          addedById: user.userId,
          thumbnailId: uploadedFile.fileData.id,
          InstructorAssignedToCourse: {
            create: {
              instructorId: user.instructorId,
            },
          },
        },
      });

      return course;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getAssignedCourses(user: InstructorJwtDto, queryDto: CourseFilterDto) {
    try {
      if (!queryDto.limit) {
        queryDto.limit = 10;
      }
      if (!queryDto.pageNumber) {
        queryDto.pageNumber = 1;
      }

      const courses = await this.prisma.course.findMany({
        where: {
          InstructorAssignedToCourse: {
            some: {
              instructorId: user.instructorId,
            },
          },
          AND: [
            {
              categoryId: queryDto.categoryId,
            },
            {
              languageId: queryDto.languageId,
            },
            {
              departmentId: queryDto.departmentId,
            },
            {
              subjectId: queryDto.subjectId,
            },
            {
              approvalStatus: queryDto.approvalStatus,
            },
          ],
        },
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          startDate: true,
          endDate: true,
          price: true,
          approvalStatus: true,
          thumbnail: true,
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          addedBy: {
            select: {
              id: true,
              name: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          language: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: Number(queryDto.limit) * (Number(queryDto.pageNumber) - 1),
        take: Number(queryDto.limit),
      });

      const totalCount = await this.prisma.course.count({
        where: {
          InstructorAssignedToCourse: {
            some: {
              instructorId: user.instructorId,
            },
          },
          AND: [
            {
              categoryId: queryDto.categoryId,
            },
            {
              languageId: queryDto.languageId,
            },
            {
              departmentId: queryDto.departmentId,
            },
            {
              subjectId: queryDto.subjectId,
            },
            {
              approvalStatus: queryDto.approvalStatus,
            },
          ],
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

  async assignedCoursesStats(user: InstructorJwtDto) {
    try {
      const totalCourses = await this.prisma.course.count({
        where: {
          InstructorAssignedToCourse: {
            some: {
              instructorId: user.instructorId,
            },
          },
        },
      });

      const totalPendingCourses = await this.prisma.course.count({
        where: {
          InstructorAssignedToCourse: {
            some: {
              instructorId: user.instructorId,
            },
          },
          approvalStatus: AdminApprovalEnum.approved,
        },
      });

      const totalDeclinedCourses = await this.prisma.course.count({
        where: {
          InstructorAssignedToCourse: {
            some: {
              instructorId: user.instructorId,
            },
          },
          approvalStatus: AdminApprovalEnum.declined,
        },
      });

      return {
        totalCourses,
        totalPendingCourses,
        totalDeclinedCourses,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
   async getAllCourses(
    user: InstructorJwtDto, 
   ){
    try {
      const courses = await this.prisma.course.findMany({
        where: {
          InstructorAssignedToCourse: {
            some: {
              instructorId: user.instructorId,

            },
          },
        }, 
      }) 
      return courses;
    }
    catch(error){
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }

   }

}

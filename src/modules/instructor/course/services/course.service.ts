import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from '../dtos/createCourse.dto';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { AdminApprovalEnum } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  async createCourse(createCourseDto: CreateCourseDto, user: InstructorJwtDto) {
    try {
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

      const course = await this.prisma.course.create({
        data: {
          ...createCourseDto,
          addedById: user.userId,
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

  async getAssignedCourses(user: InstructorJwtDto) {
    try {
      const courses = await this.prisma.course.findMany({
        where: {
          InstructorAssignedToCourse: {
            some: {
              instructorId: user.instructorId,
            },
          },
          approvalStatus: AdminApprovalEnum.approved
        },
        include: {
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
          createdAt: "desc"
        }
      });
      
      return courses;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}

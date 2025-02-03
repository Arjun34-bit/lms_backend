import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubjectFilterDto } from '../dtos/subjectFilter.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CourseFilterDto } from '../dtos/courseFilter.dto';
import { AdminApprovalEnum } from '@prisma/client';
import { ResendEmailVerificationLinkDto } from '../dtos/resendVerificationLink.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { firebaseAuth } from 'src/config/firebase.config';

@Injectable()
export class CommonService {
  constructor(
    private readonly prisma: PrismaService,
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
            {
              categoryId: filterDto.categoryId,
            },
            {
              languageId: filterDto.languageId,
            },
            {
              departmentId: filterDto.departmentId,
            },
            {
              subjectId: filterDto.subjectId,
            },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: Number(queryDto.limit) * (Number(queryDto.pageNumber) - 1),
        take: Number(queryDto.limit),
      });

      const totalCount = await this.prisma.course.count({
        where: {
          approvalStatus: AdminApprovalEnum.approved,
          AND: [
            {
              categoryId: filterDto.categoryId,
            },
            {
              languageId: filterDto.languageId,
            },
            {
              departmentId: filterDto.departmentId,
            },
            {
              subjectId: filterDto.subjectId,
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
}

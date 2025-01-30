import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleLiveClassDto } from '../dtos/scheduleLiveClass.dto';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AdminApprovalEnum } from '@prisma/client';

@Injectable()
export class LiveClassService {
  constructor(private readonly prisma: PrismaService) {}

  async scheduleLiveClass(dto: ScheduleLiveClassDto, user: InstructorJwtDto) {
    try {
      if (dto.startDate < new Date()) {
        throw new BadRequestException(
          "Start Date can't be less than current date",
        );
      }
      if (dto.startDate > dto.endDate) {
        throw new BadRequestException(
          "Start Date can't be greater than End Date",
        );
      }

      const isInstructorPartOfCourse = await this.prisma.course.findFirst({
        where: {
          id: dto.courseId,
          InstructorAssignedToCourse: {
            some: {
              instructorId: user?.instructorId,
            },
          },
          approvalStatus: AdminApprovalEnum.approved
        },
        select: {
          id: true,
          title: true,
        },
      });

      if (!isInstructorPartOfCourse) {
        throw new ForbiddenException(
          `Instructor is not assigned to ${isInstructorPartOfCourse.title}`,
        );
      }

      const liveClass = await this.prisma.liveClass.create({
        data: {
          title: dto.title,
          startTime: dto.startDate,
          endTime: dto.endDate,
          courseId: dto.courseId,
          instructorId: user?.instructorId,
          scheduledById: user?.userId,
        },
      });

      return liveClass;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getLiveClass(user: InstructorJwtDto, queryDto: PaginationDto) {
    try {
      if (!queryDto.limit) {
        queryDto.limit = 10;
      }
      if (!queryDto.pageNumber) {
        queryDto.pageNumber = 1;
      }

      const liveClasses = await this.prisma.liveClass.findMany({
        where: {
          instructorId: user?.instructorId,
          approvalStatus: AdminApprovalEnum.approved
        },
        include: {
          course: true,
        },
        orderBy: {
          startTime: 'asc',
        },
        skip: Number(queryDto.limit) * (Number(queryDto.pageNumber) - 1),
        take: Number(queryDto.limit),
      });

      const totalCount = await this.prisma.liveClass.count({
        where: {
          instructorId: user?.instructorId,
          approvalStatus: AdminApprovalEnum.approved
        },
      });

      return {
        data: liveClasses,
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
}

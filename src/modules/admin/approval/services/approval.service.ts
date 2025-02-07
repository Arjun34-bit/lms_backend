import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AdminApprovalEnum, RoleEnum } from '@prisma/client';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { InstructorApprovalDto } from '../dto/instructorApproval.dto';
import { CourseApprovalDto } from '../dto/courseApproval.dto';

@Injectable()
export class ApprovalService {
  constructor(private readonly prisma: PrismaService) {}

  async getListOfPendingInstructors(queryDto: PaginationDto) {
    try {
      if (!queryDto.limit) {
        queryDto.limit = 10;
      }
      if (!queryDto.pageNumber) {
        queryDto.pageNumber = 1;
      }
      const pendingInstructors = await this.prisma.user.findMany({
        where: {
          verified: true,
          role: RoleEnum.instructor,
          instructor: {
            approvalStatus: AdminApprovalEnum.pending,
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          role: true,
          verified: true,
          instructor: {
            select: {
              id: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          created_at: true,
          updated_at: true
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: Number(queryDto.limit) * (Number(queryDto.pageNumber) - 1),
        take: Number(queryDto.limit),
      });

      const totalCount = await this.prisma.user.count({
        where: {
          verified: true,
          role: RoleEnum.instructor,
          instructor: {
            approvalStatus: AdminApprovalEnum.pending,
          },
        },
      });

      return {
        pendingInstructors,
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

  async approveOrRejectInstructor(dto: InstructorApprovalDto) {
    try {
      const instructor = await this.prisma.instructor.count({
        where: {
          id: dto.instructorId
        }
      });
      if(!instructor) {
        throw new BadRequestException("Instructor not found!");
      }
      const updateInstructor = await this.prisma.instructor.update({
        where: {
          id: dto.instructorId
        },
        data: {
          approvalStatus: dto.approvalStatus
        }
      });

      return {
        approvalStatus: updateInstructor.approvalStatus,
        message: `Instructor has been ${updateInstructor.approvalStatus}.`
      }
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async getListOfPendingCourses(queryDto: PaginationDto) {
    try {
      if (!queryDto.limit) {
        queryDto.limit = 10;
      }
      if (!queryDto.pageNumber) {
        queryDto.pageNumber = 1;
      }
      const pendingCourses = await this.prisma.course.findMany({
        where: {
          approvalStatus: AdminApprovalEnum.pending
        },
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          department: {
            select: {
              id: true,
              name: true
            }
          },
          subject: {
            select: {
              id: true,
              name: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          },
          language: {
            select: {
              id: true,
              name: true
            }
          },
          addedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true
            }
          },
          InstructorAssignedToCourse: {
            select: {
              instructor: {
                select: {
                  id: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phoneNumber: true
                    }
                  }
                }
              }
            }
          },
          created_at: true,
          updated_at: true
        },
        orderBy: {
          created_at: 'desc',
        },
        skip: Number(queryDto.limit) * (Number(queryDto.pageNumber) - 1),
        take: Number(queryDto.limit),
      });

      const totalCount = await this.prisma.course.count({
        where: {
          approvalStatus: AdminApprovalEnum.pending
        },
      });

      return {
        pendingCourses,
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

  async approveOrRejectCourse(dto: CourseApprovalDto) {
    try {
      const checkCourse = await this.prisma.course.count({
        where: {
          id: dto.courseId
        }
      });
      if(!checkCourse) {
        throw new BadRequestException("Course not found!");
      }
      const updateCourse = await this.prisma.course.update({
        where: {
          id: dto.courseId
        },
        data: {
          approvalStatus: dto.approvalStatus
        }
      });

      return {
        approvalStatus: updateCourse.approvalStatus,
        message: `Course has been ${updateCourse.approvalStatus}.`
      }
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}

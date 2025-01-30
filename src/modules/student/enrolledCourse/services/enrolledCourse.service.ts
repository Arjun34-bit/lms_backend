import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PaymentStatusEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnrolledCourseService {
  constructor(private readonly prisma: PrismaService) {}

  async getEnrolledCourses(user: StudentJwtDto) {
    try {
      const enrolledCourse = await this.prisma.studentCourseEnrolled.findMany({
        where: {
          studentId: user?.studentId,
          courseBuy: {
            status: PaymentStatusEnum.COMPLETED
          }
        },
        select: {
          id: true,
          courseId: true,
          course: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return enrolledCourse;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}

import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LiveClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async getLiveClasses(user: StudentJwtDto) {
    try {
      const liveClasses = await this.prisma.liveClass.findMany({
        where: {
          course: {
            studentCourseEnrolled: {
              some: {
                studentId: user.studentId
              }
            }
          }
        },
        include: {
          course: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      });

      return liveClasses;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }
}

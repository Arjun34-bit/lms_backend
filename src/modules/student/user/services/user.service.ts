import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { Injectable } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: StudentJwtDto) {
    try {
      const userProfile = await this.prisma.user.findUnique({
        where: {
          id: user.userId,
          role: RoleEnum.student,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          firebaseUid: true,
          role: true,
          address: true,
          verified: true,
          student: {
            select: {
              id: true,
              studentCourseEnrolled: {
                select: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return userProfile;
    } catch (error) {}
  }
}

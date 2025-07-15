import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { StudentProfileUpdateDto } from '../dto/updateStudent.dto';
import { firebaseAuth } from 'src/config/firebase.config';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: StudentJwtDto) {
    try {
      const userProfile = await this.prisma.user.findUnique({
        where: {
          id: user.userId,
          // role: RoleEnum.student,
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

  async updateStudentProfile(
    user: StudentJwtDto,
    data: StudentProfileUpdateDto,
  ) {
    try {
      const student = await this.prisma.user.findUnique({
        where: {
          id: user.userId,
        },
        // include: {
        //   user: true,
        // },
      });

      if (!student) {
        throw new NotFoundException('Student not found');
      }

      if (student.firebaseUid) {
        await firebaseAuth.updateUser(student.firebaseUid, {
          displayName: data.name ?? student.name,
          phoneNumber: data.phoneNumber ?? student.phoneNumber,
        });
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.userId,
        },
        data: {
          name: data.name ? data.name : user.name,
          email: data.email
            ? data.email.toLowerCase()
            : user.email.toLowerCase(),
          phoneNumber: data.phoneNumber ? data.phoneNumber : user.phoneNumber,
        },
      });

      return {
        message: 'Student Profile Updated',
        user: {
          userId: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          // role: updatedUser.role,
        },
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error.stack);
      }
      throw error;
    }
  }
}

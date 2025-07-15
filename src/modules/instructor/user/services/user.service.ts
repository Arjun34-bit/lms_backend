import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { firebaseAuth } from 'src/config/firebase.config';
import { InstructorProfileUpdateDto } from '../dtos/instructorProfileDto.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(user: InstructorJwtDto) {
    try {
      const userProfile = await this.prisma.user.findUnique({
        where: {
          id: user.userId,
          role: RoleEnum.instructor,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          firebaseUid: true,
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
              instructorSubjects: {
                select: {
                  id: true,
                  subject: {
                    select: {
                      name: true,
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

  async updateInstructorProfile(
    user: InstructorJwtDto,
    data: InstructorProfileUpdateDto,
  ) {
    try {
      const instructor = await this.prisma.instructor.findUnique({
        where: {
          userId: user.userId,
        },
        include: {
          user: true,
        },
      });

      if (!instructor) {
        throw new NotFoundException('Instructor not found');
      }

      if (instructor.approvalStatus !== 'approved') {
        throw new ForbiddenException(
          'Profile updates allowed only after approval',
        );
      }

      await firebaseAuth.updateUser(instructor.user.firebaseUid, {
        displayName: data.name,
        phoneNumber: data.phoneNumber,
      });

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
        message: 'Profile updated successfully',
        user: {
          userId: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          role: updatedUser.role,
          verified: updatedUser.verified,
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

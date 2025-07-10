import { Injectable, UnauthorizedException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from '../dto/login.dto';
import { AdminPhoneLoginDto } from '../dto/phone-login.dto';
import { envConstant } from '@constants/index';
import { firebaseAuth } from 'src/config/firebase.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminApprovalEnum, RoleEnum } from '@prisma/client';
import * as bcrypt from 'bcryptjs';


// List of authorized admin phone numbers
const AUTHORIZED_ADMIN_PHONES = envConstant.AUTHORIZED_ADMIN_PHONES?.split(',') || [];

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async loginWithPhoneNumber(phoneLoginDto: AdminPhoneLoginDto): Promise<{ access_token: string; user: any }> {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(phoneLoginDto.idToken);
      const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);

      if (!firebaseUser.phoneNumber) {
        throw new BadRequestException('No phone number associated with this account');
      }

      // Check if the phone number is in the authorized list
      if (!AUTHORIZED_ADMIN_PHONES.includes(firebaseUser.phoneNumber)) {
        throw new UnauthorizedException('This phone number is not authorized for admin access');
      }

      const payload = {
        username: firebaseUser.phoneNumber,
        sub: firebaseUser.uid,
        role: 'admin',
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: {
          phoneNumber: firebaseUser.phoneNumber,
          role: 'admin',
        },
      };
    } catch (error) {
      Logger.error(`Admin phone login error: ${error.message}`);
      throw error;
    }
  }

  async login(adminLoginDto: AdminLoginDto): Promise<{ access_token: string; user: any }> {
    const { email, password } = adminLoginDto;

    // check if email exist in user
const user = await this.prisma.user.findUnique({
          where: { email: email },
        });
        if (!user) {
          throw new UnauthorizedException('Invalid email or password');
        }            
        if (user.role!==RoleEnum.admin) {
          throw new UnauthorizedException('Invalid email or password');
        }
        if (!(await bcrypt.compare(password, user.password))) {
          throw new BadRequestException('Invalid email or password');
        }

   const payload = {
      username: user.email, // Or a generic admin username
      sub: user.id, // A static or generated admin user ID
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: user.email,
        role: user.role,
      },
    };

     }

  async approveInstructor(instructorId: string, approvalStatus: AdminApprovalEnum) {
    try {
      const instructor = await this.prisma.instructor.findUnique({
        where: { id: instructorId },
        include: { user: true },
      });

      if (!instructor || !instructor.user) {
        throw new NotFoundException('Instructor or associated user not found');
      }

      const updatedInstructor = await this.prisma.instructor.update({
        where: { id: instructorId },
        data: { approvalStatus },
        include: { user: true },
      });

      return updatedInstructor;
    } catch (error) {
      Logger.error(`Instructor approval error: ${error.message}`);
      throw error;
    }
  }

  async getPendingInstructors(limit: number, pageNumber: number) {
    try {
      const skip = (pageNumber - 1) * limit;
      
      const [pendingInstructors, total] = await Promise.all([
        this.prisma.instructor.findMany({
          where: { approvalStatus: AdminApprovalEnum.pending },
          include: { user: true },
          take: limit,
          skip: skip
        }),
        this.prisma.instructor.count({
          where: { approvalStatus: AdminApprovalEnum.pending }
        })
      ]);

      return {
        data: pendingInstructors,
        meta: {
          total,
          pageNumber,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      Logger.error(`Get pending instructors error: ${error.message}`);
      throw error;
    }
  }
  async getApprovedInstructors(limit: number, pageNumber: number) {
    const skip = (pageNumber - 1) * limit;
  
    const [approvedInstructors, total] = await Promise.all([
      this.prisma.instructor.findMany({
        where: { approvalStatus: AdminApprovalEnum.approved },
        include: { user: true },
        take: limit,
        skip: skip,
      }),
      this.prisma.instructor.count({
        where: { approvalStatus: AdminApprovalEnum.approved },
      }),
    ]);
  
    return {
      data: approvedInstructors,
      meta: {
        total,
        pageNumber,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getPendingCourses(limit: number, pageNumber: number) {
    try {
      const skip = (pageNumber - 1) * limit;
      
      const [pendingCourses, total] = await Promise.all([
        this.prisma.course.findMany({
          where: { approvalStatus: AdminApprovalEnum.pending },
          include: {
            category: true,
            department: true,
            subject: true,
            language: true,
            InstructorAssignedToCourse: {
              include: {
                instructor: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
          take: limit,
          skip: skip,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.course.count({
          where: { approvalStatus: AdminApprovalEnum.pending },
        })
      ]);

      return {
        data: pendingCourses,
        meta: {
          total,
          pageNumber,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      Logger.error(`Get pending courses error: ${error.message}`);
      throw error;
    }
  }

  async getApprovedCourses(limit: number, pageNumber: number) {
    try {
      const skip = (pageNumber - 1) * limit;
      
      const [approvedCourses, total] = await Promise.all([
        this.prisma.course.findMany({
          where: { approvalStatus: AdminApprovalEnum.approved },
          include: {
            category: true,
            department: true,
            subject: true,
            language: true,
            InstructorAssignedToCourse: {
              include: {
                instructor: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
          take: limit,
          skip: skip,
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.course.count({
          where: { approvalStatus: AdminApprovalEnum.approved },
        })
      ]);

      return {
        data: approvedCourses,
        meta: {
          total,
          pageNumber,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      Logger.error(`Get approved courses error: ${error.message}`);
      throw error;
    }
  }

  async approveCourse(courseId: string, approvalStatus: AdminApprovalEnum) {
    try {
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new NotFoundException('Course not found');
      }

      const updatedCourse = await this.prisma.course.update({
        where: { id: courseId },
        data: { approvalStatus },
        include: {
          category: true,
          department: true,
          subject: true,
          language: true,
          InstructorAssignedToCourse: {
            include: {
              instructor: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      return updatedCourse;
    } catch (error) {
      Logger.error(`Course approval error: ${error.message}`);
      throw error;
    }
  }
  
}



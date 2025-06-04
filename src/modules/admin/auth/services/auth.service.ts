import { Injectable, UnauthorizedException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from '../dto/login.dto';
import { AdminPhoneLoginDto } from '../dto/phone-login.dto';
import { envConstant } from '@constants/index';
import { firebaseAuth } from 'src/config/firebase.config';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminApprovalEnum } from '@prisma/client';

// List of authorized admin phone numbers
const AUTHORIZED_ADMIN_PHONES = envConstant.AUTHORIZED_ADMIN_PHONES?.split(',') || [];

// In a real application, these would be stored securely, e.g., in environment variables or a config service
const ADMIN_EMAIL = envConstant.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = envConstant.ADMIN_PASSWORD || "admin123"; // Store hashed password

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

    // Securely compare the provided password with the stored hash
    // For simplicity in this example, we'll pre-hash the password if ADMIN_PASSWORD_HASH is not set.
    // In a production scenario, the hash should be pre-generated and stored.
    let isValidPassword = password === ADMIN_PASSWORD;
   
   

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || !isValidPassword) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const payload = {
      username: ADMIN_EMAIL, // Or a generic admin username
      sub: 'admin_user_id', // A static or generated admin user ID
      role: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: ADMIN_EMAIL,
        role: 'admin',
      },
    };
  }

  async approveInstructor(instructorId: string, approvalStatus: AdminApprovalEnum) {
    try {
      const instructor = await this.prisma.instructor.findUnique({
        where: { id: instructorId },
        include: { user: true },
      });

      if (!instructor) {
        throw new NotFoundException('Instructor not found');
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
  
  
}



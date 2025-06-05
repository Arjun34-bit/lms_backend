import { Injectable, UnauthorizedException, BadRequestException, Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ParentSignupDto, ParentSigninDto, ConnectChildrenDto, DisconnectChildrenDto } from '../dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RoleEnum } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { firebaseAuth } from 'src/config/firebase.config';



@Injectable()
export class ParentAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

  ) { }
  async signup(dto: ParentSignupDto) {
    const existingParent = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      },
    });

    if (existingParent) {
      throw new BadRequestException('Email already exists');
    }    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = this.jwtService.sign(
      { email: dto.email, role: RoleEnum.parent },
      { expiresIn: '1h' }
    );

    const parent = await this.prisma.parent.create({
      data: {
        user: {
          create: {
            email: dto.email,
            password: hashedPassword,
            name: dto.name,
            role: RoleEnum.parent,
            verified: false,
          }
        },
        address: dto.address,
      },
      include: {
        user: true,
        students: true,
      }
    });

    // Store verification token in cache
    await this.cacheManager.set(
      `user-verification:${verificationToken}`,
      JSON.stringify({
        email: dto.email,
        role: RoleEnum.parent,
      }),
      60 * 60 * 1000 // 1 hour expiry
    );

    this.eventEmitter.emit('user.sendVerificationLink', {
      email: parent.user.email,
      role: parent.user.role,
    });

    return {
      token: this.generateToken(parent),
      parent: this.sanitizeParent(parent),
      message: 'Signup successful. Please verify your email to continue.',
    };
  }
  async verifyEmail(verificationToken: string) {
    try {
      const cacheKey = `user-verification:${verificationToken}`;
      const userData: any = await this.cacheManager.get(cacheKey);
      if (!userData) {
        throw new BadRequestException('Invalid link or link has been expired');
      }
      const user = JSON.parse(userData);

      const userUpdated = await this.prisma.user.update({
        where: {
          email: user?.email,
          role: user?.role,
        },
        data: {
          verified: true,
        },
      });

      // Remove the verification token from cache after successful verification
      await this.cacheManager.del(cacheKey);

      return { message: 'Parent account has been verified successfully' };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }  async loginWithPhoneNumber(idToken: string) {
    try {
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);

      let user = await this.prisma.user.findFirst({
        where: { firebaseUid: firebaseUser.uid },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: firebaseUser.displayName ?? 'Unknown User',
            email: firebaseUser.email ?? null,
            role: RoleEnum.parent,
            firebaseUid: firebaseUser.uid,
            verified: true, // Phone-based login is automatically verified
            phoneNumber: firebaseUser.phoneNumber,
            parent: {
              create: {},
            },
          },
          include: {
            parent: true
          }
        });
      }
      const parent = await this.prisma.parent.findUnique({
        where: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      });
      // Payload to return after verification/login/signup
      const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: RoleEnum.parent,
        parentId: parent.id,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }  async signin(dto: ParentSigninDto) {
    const parent = await this.prisma.parent.findFirst({
      where: {
        user: {
          email: dto.email
        }
      },
      include: {
        user: true,
        students: true
      }
    });

    if (!parent || !await bcrypt.compare(dto.password, parent.user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if the user is verified
    if (!parent.user.verified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    return {
      token: this.generateToken(parent),
      parent: this.sanitizeParent(parent)
    };
  }

  async connectChildren(parentId: string, dto: ConnectChildrenDto) {
    // First verify the parent exists
    const parent = await this.prisma.parent.findUnique({
      where: {
        id: parentId // Using the string ID directly
      }
    });
    if (!parent) {
      throw new BadRequestException('Parent not found');
    }

    await this.prisma.parent.update({
      where: { id: parentId },
      data: {
        students: {
          connect: dto.studentIds.map(id => ({ id }))
        }
      }
    });

    return { message: 'Children connected successfully' };
  }

  async disconnectChildren(parentId: string, dto: DisconnectChildrenDto) {
    // First verify the parent exists
    const parent = await this.prisma.parent.findUnique({
      where: {
        id: parentId // Using the string ID directly
      }
    });
    if (!parent) {
      throw new BadRequestException('Parent not found');
    }

    // Disconnect multiple children from the parent
    await this.prisma.parent.update({
      where: { id: parentId },
      data: {
        students: {
          disconnect: dto.studentIds.map(id => ({ id }))
        }
      }
    });

    return { message: 'Children disconnected successfully' };
  }

  async getChildren(parentId: string) {
    const parent = await this.prisma.parent.findUnique({
      where: {
        id: parentId
      },
      include: {
        students: {
          include: {
            user: true

          }
        }
      }
    });

    if (!parent) {
      throw new BadRequestException('Parent not found');
    }

    const childrenDetails = parent.students.map(student => ({
      studentId: student.id,      // Student record's ID
      userId: student.user?.id,   // Student's User ID
      name: student.user?.name,
      address: student?.user?.address   // Student's name
    }));

    return {
      parentId: parent.id,
      children: childrenDetails
    };
  }

  private generateToken(parent: any) {
    return this.jwtService.sign({
      id: parent.id,
      email: parent.user.email,
      role: 'parent'
    });
  }

  private sanitizeParent(parent: any) {
    const { user, ...parentData } = parent;
    return {
      ...parentData,
      name: user.name,
      email: user.email
    };
  }
}

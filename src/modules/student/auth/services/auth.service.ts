import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RoleEnum } from '@prisma/client';
import { firebaseAuth } from 'src/config/firebase.config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async signupWithEmail(data: SignUpDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: data.email?.toLowerCase(),
        }, 
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const verificationToken = this.jwtService.sign(
        { email: data.email, role: RoleEnum.student },
        { expiresIn: '1h' },
      );

      const createdUser = await this.prisma.student.create({
        data: {
          user: {
            create: {
              email: data.email?.toLowerCase(),
              password: hashedPassword,
              name: data.name,
              role: RoleEnum.student,
              verified: false,
            },
          },
        },
        include: {
          user: true,
        },
      });

      // Store verification token in cache
      await this.cacheManager.set(
        `user-verification:${verificationToken}`,
        JSON.stringify({
          email: data.email,
          role: RoleEnum.student,
        }),
        60 * 60 * 1000, // 1 hour expiry
      );

      const payload = {
        userId: createdUser.id,
        name: createdUser.user.name,
        email: createdUser.user.email,
        role: RoleEnum.student,
      };

      this.eventEmitter.emit('user.sendVerificationLink', {
        email: createdUser.user.email,
        role: createdUser.user.role,
      });

      return payload;
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
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

      return { message: 'Student account has been verified successfully' };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async loginWithPhoneNumber(idToken: string) {
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
            role: RoleEnum.student,
            firebaseUid: firebaseUser.uid,
            verified: true, // Mark as verified
            student: {},
          },
        });
      }
      const student = await this.prisma.student.findUnique({
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
        role: RoleEnum.student,
        studentId: student.id,
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
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          student: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new BadRequestException("User doesn't exist. Please signup.");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      if (!user.verified) {
        throw new BadRequestException(
          'Email not verified. Please verify before logging in.',
        );
      }

      const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: RoleEnum.student,
        studentId: user?.student?.id,
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
  }

  async googleLogin(idToken: string) {
    try {
      // Verify the ID token with Firebase Admin SDK
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const { email, name, uid } = decodedToken;
      if (!email) {
        throw new BadRequestException('Invalid Google account');
      }

      // Check if the user already exists
      let user: any = await this.prisma.user.findUnique({
        where: { email },
        include: {
          student: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!user) {
        // If user doesn't exist, create a new user
        user = await this.prisma.user.create({
          data: {
            name: name || 'Google User',
            email: email.toLowerCase(),
            password: null, // No password for Google users
            role: RoleEnum.student,
            firebaseUid: uid,
            verified: true,
            student: {
              create: {},
            },
            // googleId: uid, // Save Firebase UID for reference
          },
        });
      }

      // Generate JWT payload
      const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        student: user?.student?.id,
      };
      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    } catch (error) {
      Logger.error('Error during Google login: ', error?.stack);
      throw new BadRequestException('Invalid Google token');
    }
  }
}

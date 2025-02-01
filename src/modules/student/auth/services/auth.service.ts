import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '../dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RoleEnum } from '@prisma/client';
import { firebaseAuth } from 'src/config/firebase.config';
import { envConstant } from '@constants/index';
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
      const existingUser = await this.prisma.user.count({
        where: { email: data.email?.toLowerCase() },
      });
      const existingUserInFirebase =  await firebaseAuth.getUserByEmail(data.email.toLowerCase());
      
      if (existingUser && existingUserInFirebase) {
        throw new BadRequestException('Email already exists');
      }
      
      let userInFirebase:any;
      if (existingUserInFirebase) {
        // Update existing user
        userInFirebase = await firebaseAuth.updateUser(existingUserInFirebase.uid, {
          displayName: data.name,
          phoneNumber: data.phoneNumber,
          password: data.password,
        });
      } else {
        // Create new user
        userInFirebase = await firebaseAuth.createUser({
          displayName: data.name,
          email: data.email.toLowerCase(),
          emailVerified: false,
          disabled: false,
          phoneNumber: data.phoneNumber,
          password: data.password,
        });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const createdUser = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email?.toLowerCase(),
          password: hashedPassword,
          role: RoleEnum.student,
          verified: userInFirebase.emailVerified,
          firebaseUid: userInFirebase.uid,
          student: {
            create: {},
          },
        },
      });

      const payload = {
        userId: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: RoleEnum.student,
      };
      this.eventEmitter.emit('user.sendVerificationLink', {
        email: createdUser.email,
        role: createdUser.role,
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

      await firebaseAuth.updateUser(userUpdated.firebaseUid, {
        emailVerified: true
      })

      return { message: 'Instructor account has been verified successfully' };
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
            student: {
              create: {},
            },
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

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      const fireAuthUser = await firebaseAuth.getUserByEmail(email);
      if (!fireAuthUser.emailVerified || !user.verified) {
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
            firebaseUid: uid,
            password: null,
            verified: true,
            role: RoleEnum.student,
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
        studentId: user?.student?.id,
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

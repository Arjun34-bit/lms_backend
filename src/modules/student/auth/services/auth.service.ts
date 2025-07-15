import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
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

      await this.cacheManager.set(
        `user-verification:${verificationToken}`,
        JSON.stringify({
          email: data.email,
          role: RoleEnum.student,
        }),
        60 * 60 * 1000, // 1 hour
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
      Logger.error(error?.stack || error?.message || error);
      throw error instanceof BadRequestException
        ? error
        : new BadRequestException('Something went wrong during signup');
    }
  }

  async verifyEmail(verificationToken: string) {
    try {
      const cacheKey = `user-verification:${verificationToken}`;
      const userData: any = await this.cacheManager.get(cacheKey);

      if (!userData) {
        throw new BadRequestException('Invalid or expired verification link');
      }

      const user = JSON.parse(userData);

      await this.prisma.user.update({
        where: {
          email: user?.email,
          role: user?.role,
        },
        data: {
          verified: true,
        },
      });

      await this.cacheManager.del(cacheKey);

      return { message: 'Student account has been verified successfully' };
    } catch (error) {
      Logger.error(error?.stack || error?.message || error);
      throw error instanceof BadRequestException
        ? error
        : new BadRequestException('Something went wrong during verification');
    }
  }

  async loginWithPhoneNumber(idToken: string) {
    try {
      let decodedToken;
      try {
        decodedToken = await firebaseAuth.verifyIdToken(idToken);
      } catch {
        throw new UnauthorizedException('Invalid or expired Firebase ID token');
      }

      const firebaseUser = await firebaseAuth.getUser(decodedToken.uid);

      let user = await this.prisma.user.findFirst({
        where: { firebaseUid: firebaseUser.uid },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: firebaseUser.displayName ?? 'Unknown User',
            email: firebaseUser.email ?? null,
            phoneNumber: firebaseUser.phoneNumber ?? null,
            role: RoleEnum.student,
            firebaseUid: firebaseUser.uid,
            verified: true,
            student: {},
          },
        });
      }

      const student = await this.prisma.student.findUnique({
        where: { userId: user.id },
        select: { id: true },
      });

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
      Logger.error(error?.stack || error?.message || error);
      throw error instanceof UnauthorizedException
        ? error
        : new BadRequestException('Phone login failed');
    }
  }

  async googleLogin(idToken: string) {
    try {
      let decodedToken;
      try {
        decodedToken = await firebaseAuth.verifyIdToken(idToken);
      } catch {
        throw new UnauthorizedException('Invalid or expired Google ID token');
      }

      const { email, name, uid } = decodedToken;

      if (!email) {
        throw new BadRequestException('Invalid Google account');
      }

      let user = await this.prisma.user.findUnique({
        where: { email },
        include: {
          student: {
            select: { id: true },
          },
        },
      });

      console.log(user?.phoneNumber);

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: name || 'Google User',
            email: email.toLowerCase(),
            password: null,
            phoneNumber: user?.phoneNumber,
            role: RoleEnum.student,
            firebaseUid: uid,
            verified: true,
            student: {
              create: {},
            },
          },
          include: {
            student: { select: { id: true } },
          },
        });
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
      Logger.error(error?.stack || error?.message || error);
      throw error instanceof UnauthorizedException ||
        error instanceof BadRequestException
        ? error
        : new BadRequestException('Google login failed');
    }
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          student: { select: { id: true } },
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
        phoneNumber: user?.phoneNumber,
        role: RoleEnum.student,
        studentId: user?.student?.id,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: payload,
      };
    } catch (error) {
      Logger.error(error?.stack || error?.message || error);
      throw error instanceof BadRequestException
        ? error
        : new BadRequestException('Login failed');
    }
  }
}

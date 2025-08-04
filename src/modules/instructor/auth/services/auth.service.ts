import {
  BadRequestException,
  ForbiddenException,
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {}

  async signup(data: SignUpDto) {
    try {
      const existingUser = await this.prisma.user.count({
        where: {
          OR: [
            {
              email: data.email?.toLowerCase(),
            },
            {
              phoneNumber: data?.phoneNumber,
            },
          ],
        },
      });
      const existingUserInFirebase = await firebaseAuth
        .getUserByEmail(data.email.toLowerCase())
        .then((user) => user)
        .catch((error) =>
          error.code === 'auth/user-not-found'
            ? null
            : Promise.reject(
                new BadRequestException('Firebase error: ' + error.message),
              ),
        );

      if (existingUser && existingUserInFirebase) {
        throw new BadRequestException('Email already exists');
      }

      let userInFirebase: any;
      if (existingUserInFirebase) {
        // Update existing user
        userInFirebase = await firebaseAuth.updateUser(
          existingUserInFirebase.uid,
          {
            displayName: data.name,
            phoneNumber: data.phoneNumber,
            password: data.password,
          },
        );
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

      const createdUser = await this.prisma.user.upsert({
        where: {
          email: data?.email?.toLowerCase(),
        },
        create: {
          name: data.name,
          email: data.email?.toLowerCase(),
          phoneNumber: data.phoneNumber,
          password: hashedPassword,
          role: RoleEnum.instructor,
          verified: userInFirebase.emailVerified,
          firebaseUid: userInFirebase?.uid,
          instructor: {
            create: {
              departmentId: data.departmentId ? data.departmentId : undefined,
            },
          },
        },
        update: {
          name: data.name,
          email: data.email?.toLowerCase(),
          phoneNumber: data.phoneNumber,
          password: hashedPassword,
          role: RoleEnum.instructor,
          verified: userInFirebase?.emailVerified,
          firebaseUid: userInFirebase?.uid,
          instructor: {
            create: {
              departmentId: data.departmentId ? data.departmentId : undefined,
            },
          },
        },
      });

      const payload = {
        userId: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: RoleEnum.instructor,
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

      const existingUserInFirebase = await firebaseAuth
        .getUserByEmail(user?.email?.toLowerCase())
        .then((user) => user)
        .catch((error) =>
          error.code === 'auth/user-not-found'
            ? null
            : Promise.reject(
                new BadRequestException('Firebase error: ' + error.message),
              ),
        );

      const userUpdated = await this.prisma.user.update({
        where: {
          email: user?.email,
          role: user?.role,
        },
        data: {
          verified: true,
          firebaseUid: existingUserInFirebase.uid,
        },
      });

      await firebaseAuth.updateUser(userUpdated.firebaseUid, {
        emailVerified: true,
      });

      return { message: 'Instructor account has been verified successfully' };
    } catch (error) {
      if (error.statusCode === 500) {
        Logger.error(error?.stack);
      }
      throw error;
    }
  }

  async login({ email, password, rememberMe }: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          instructor: {
            select: {
              id: true,
              approvalStatus: true,
            },
          },
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid email or password');
      }

      if (!user.verified) {
        throw new BadRequestException('User account is not verified!');
      }

      if (user?.instructor?.approvalStatus !== 'approved') {
        throw new ForbiddenException('Account is not approved by an admin.');
      }

      const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: RoleEnum.instructor,
        instructorId: user?.instructor?.id,
      };

      const expiresIn = rememberMe ? '365d' : '2d';

      return {
        access_token: this.jwtService.sign(payload, { expiresIn }),
        user: payload,
      };
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
            phoneNumber: firebaseUser.phoneNumber,
            role: RoleEnum.instructor,
            firebaseUid: firebaseUser.uid,
            verified: true, // Mark as verified
            instructor: {
              create: {},
            },
          },
        });
      }
      const instructor = await this.prisma.instructor.findUnique({
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
        phoneNumber: firebaseUser.phoneNumber, // Added phone number
        role: RoleEnum.instructor,
        instructorId: instructor?.id,
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
      const decodedToken = await firebaseAuth.verifyIdToken(idToken);
      const { email, name, uid } = decodedToken;
      if (!email) {
        throw new BadRequestException('Invalid Google account');
      }

      let user: any = await this.prisma.user.findUnique({
        where: { email },
        include: {
          instructor: {
            select: {
              id: true,
            },
          },
        },
      });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            name: name || 'Google User',
            email: email.toLowerCase(),
            password: null, // No password for Google users
            role: RoleEnum.instructor,
            firebaseUid: uid,
            verified: true,
            instructor: {
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
        instructorId: user?.instructor?.id,
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

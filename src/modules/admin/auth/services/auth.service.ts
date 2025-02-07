import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { RoleEnum } from '@prisma/client';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}


  async login({ email, password }: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          admin: {
            select: {
              id: true,
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

      const payload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: RoleEnum.admin,
        adminId: user?.admin?.id,
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
}

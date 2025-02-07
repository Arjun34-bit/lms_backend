import { Injectable, Logger } from '@nestjs/common';
import { RoleEnum } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { adminSeedData } from './data/admin.seed';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminSeederService {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async adminSeed() {
    const existingAdmin = await this.prisma.user.findMany({
      where: {
        role: RoleEnum.admin,
      },
      select: { email: true },
    });

    const existingAdminEmail = existingAdmin.map((admin) => admin.email);

    const adminsToInsert = adminSeedData.filter(
      (admin) => !existingAdminEmail.includes(admin.email),
    );

    if (adminsToInsert.length > 0) {
      for (const eachAdmin of adminsToInsert) {
        const hashedPassword = await bcrypt.hash(eachAdmin.password, 10);
        const admin = await this.prisma.user.create({
          data: {
            ...eachAdmin,
            password: hashedPassword,
            admin: {
              create: {},
            },
          },
        });
        this.logger.log(`Admin with email ${admin.email} inserted`);
      }
    }
  }
}

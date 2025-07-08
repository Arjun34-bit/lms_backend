import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RoleEnum } from '@prisma/client';
import * as dotenv from 'dotenv';


@Injectable()
@Command({ name: 'seed:admin', description: 'Create an admin user' })
export class SeedCommand extends CommandRunner {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async run(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pcc.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    console.log('Starting admin user creation...');

    const existingAdmin = await this.prisma.user.findFirst({
      where: {
        email: adminEmail,
      },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Using Admin Email:', adminEmail);
console.log('Using Admin Password:', adminPassword);

      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await this.prisma.user.create({
      data: {
        email: adminEmail,
    password: hashedPassword,
    name: 'Admin',
    role: RoleEnum.admin,
      },
    });
    console.log('Admin user created successfully');
  }
}
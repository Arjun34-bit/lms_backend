import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, RoleEnum } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  private _user: any;
  public get user(): any {
    return this._user;
  }
  public set user(value: any) {
    this._user = value;
  }
  private _parent: any;
  public get parent(): any {
    return this._parent;
  }
  public set parent(value: any) {
    this._parent = value;
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedAdminUser();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async seedAdminUser() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@pcc.duoples.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await this.user.findFirst({
      where: {
        role: RoleEnum.admin,
        email: adminEmail
      }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      const user = await this.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: RoleEnum.admin,
          name: 'Admin',
          verified: true,
          admin: {
            create: {}
          }
        }
      });

      this.logger.log('Default admin user created successfully');
    } else {
      this.logger.log('Admin user already exists');
    }
  }
}

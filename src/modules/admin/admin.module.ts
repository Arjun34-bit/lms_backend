import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { RouterModule } from '@nestjs/core';
import { AdminAuthModule } from './auth/auth.module';
import { AdminApprovalModule } from './approval/approval.module';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    AdminAuthModule,
    AdminApprovalModule,
    RouterModule.register([
      {
        path: 'admin',
        children: [
          {
            path: 'auth',
            module: AdminAuthModule,
          },
          {
            path: 'approval',
            module: AdminApprovalModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [JwtModule, PassportModule], 
})
export class AdminModule {}

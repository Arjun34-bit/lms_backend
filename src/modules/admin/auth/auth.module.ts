import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envConstant } from '@constants/index';
import { AdminAuthController } from './controllers/auth.controller';
import { AdminAuthService } from './services/auth.service';
import { JwtAdminStrategy } from './services/jwt-admin.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt-admin' }),
    JwtModule.register({
      secret: envConstant.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // Admin token expiry can be set as required
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtAdminStrategy],
  exports: [JwtModule, PassportModule],
})
export class AdminAuthModule {}

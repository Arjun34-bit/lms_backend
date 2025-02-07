import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envConstant } from '@constants/index';
import { AdminAuthController } from './controllers/auth.controller';
import { AdminAuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt-admin.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-admin' }),
    JwtModule.register({
      secret: envConstant.JWT_SECRET,
      signOptions: { expiresIn: '15d' },
    }),
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtStrategy], // Add JwtStrategy here
  exports: [JwtModule, PassportModule, JwtStrategy], // Export JwtStrategy
})
export class AdminAuthModule {}


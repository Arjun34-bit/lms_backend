import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envConstant } from '@constants/index';
import { InstructorAuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt-instructor.strategy';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt-instructor' }),
    JwtModule.register({
      secret: envConstant.JWT_SECRET,
      signOptions: { expiresIn: '15d' },
    }),
  ],
  controllers: [InstructorAuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule, PassportModule],
})
export class InstructorAuthModule {}

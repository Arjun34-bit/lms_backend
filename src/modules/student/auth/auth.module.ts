import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { envConstant } from '@constants/index';
import { StudentAuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt-student.strategy';

@Module({
  imports: [
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt-student' }),
    JwtModule.register({
      secret: envConstant.JWT_SECRET,
      signOptions: { expiresIn: '15d' },
    }),
  ],
  controllers: [StudentAuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtModule, PassportModule],
})
export class StudentAuthModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SupportAuthController } from './controllers/auth.controller';
import { SupportAuthService } from './services/auth.service';
import { JwtSupportStrategy } from './strategies/jwt-support.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt-support' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [SupportAuthController],
    providers: [SupportAuthService, JwtSupportStrategy],
    exports: [SupportAuthService, JwtSupportStrategy]
})
export class SupportAuthModule {}
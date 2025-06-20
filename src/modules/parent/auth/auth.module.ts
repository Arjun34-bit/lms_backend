import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ParentAuthController } from './controllers/auth.controller';
import { ParentAuthService } from './services/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtParentStrategy } from './strategies/jwt.strategy';
//import { JwtParentGoogleStrategy } from './strategies/jwt-parent-google.strategy';
@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get('JWT_SECRET'),
                signOptions: { expiresIn: '1d' },
            }),
        }),
    ],
    controllers: [ParentAuthController],
    providers: [ParentAuthService, JwtParentStrategy, PrismaService,], 
})
export class ParentAuthModule { }

// JwtParentGoogleStrategy

// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { ConfigService } from '@nestjs/config';
// import { ParentAuthController } from './controllers/auth.controller';
// import { ParentAuthService } from './services/auth.service';
// import { PrismaService } from 'src/prisma/prisma.service';
// import { JwtParentStrategy } from './strategies/jwt.strategy';
// //import { JwtParentGoogleStrategy } from './strategies/jwt-parent-google.strategy';
// import { GoogleModule } from 'src/modules/common/services/google/google.module';
// @Module({
//     imports: [
//         JwtModule.registerAsync({
//             inject: [ConfigService],
//             useFactory: (config: ConfigService) => ({
//                 secret: config.get('JWT_SECRET'),
//                 signOptions: { expiresIn: '1d' },
//             }),
//         }),
//     ],
//     controllers: [ParentAuthController],
//     providers: [ParentAuthService, JwtParentStrategy, PrismaService,GoogleModule], 
// })
// export class ParentAuthModule { }

// // JwtParentGoogleStrategy
// src/modules/parent/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ParentAuthController } from './controllers/auth.controller';
import { ParentAuthService } from './services/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtParentStrategy } from './strategies/jwt.strategy';
import { GoogleModule } from 'src/modules/common/services/google/google.module'; // ✅ correct
import { EmailService } from './services/email.service';
@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    GoogleModule, // ✅ MUST be here (not in providers)
  ],
  controllers: [ParentAuthController],
  providers: [ParentAuthService, JwtParentStrategy, PrismaService ,EmailService],
})
export class ParentAuthModule {}

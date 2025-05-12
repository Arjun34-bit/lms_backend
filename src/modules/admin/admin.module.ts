import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminAuthModule } from './auth/auth.module';


@Module({
    imports: [
        PrismaModule,
        AdminAuthModule
     
    ],
})
export class AdminModule { }

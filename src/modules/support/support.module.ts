import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupportThreadModule } from './crudoperation/supportthread.module';
import { SupportAuthModule } from './auth/auth.module';


@Module({
    imports: [
        PrismaModule,
        SupportThreadModule,
        SupportAuthModule
    ],
    exports: [SupportAuthModule]
})
export class SupportModule { }

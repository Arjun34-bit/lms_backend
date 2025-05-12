import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminAuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module'; // Added import


@Module({
    imports: [
         PrismaModule,
        AdminAuthModule,
        CategoryModule // Added CategoryModule to imports
     
    ],
})
export class AdminModule { }

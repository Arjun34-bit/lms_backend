import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { AttendanceModule } from './attendance/attendance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TestResultsModule } from './test-results/test-results.module';
import { auth } from 'firebase-admin';
import { ParentAuthModule } from './auth/auth.module';

@Module({
    imports: [
        PrismaModule,
        CoursesModule,
        AttendanceModule,
        NotificationsModule,
        TestResultsModule,
        ParentAuthModule
    ],
})
export class ParentModule { }

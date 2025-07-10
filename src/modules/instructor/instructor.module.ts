import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { InstructorAuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { CourseModule } from './course/course.module';
import { LiveClassModule } from './liveclass/liveclass.module';
import { UserModule } from './user/user.module';
import { MediasoupModule } from './mediasoup/mediasoup.module';
import { LessonModule } from './lesson/lesson.module';
import { ReelModule } from './reel/reel.module';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    InstructorAuthModule,
    CourseModule,
    LessonModule,
    LiveClassModule,
    UserModule,
    MediasoupModule,
    ReelModule,
    RouterModule.register([
      {
        path: 'instructor',
        children: [
          {
            path: 'auth',
            module: InstructorAuthModule,
          },
          {
            path: 'course',
            module: CourseModule,
          },
          {
            path: 'lesson',
            module: LessonModule,
          },
          {
            path: 'live-class',
            module: LiveClassModule,
          },
          {
            path: 'user',
            module: UserModule,
          },
          {
            path: 'reel',
            module: ReelModule,
          },
        ],
      },
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [JwtModule, PassportModule],
})
export class InstructorModule {}

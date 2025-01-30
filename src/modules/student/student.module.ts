import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StudentAuthModule } from './auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { EnrolledCourseModule } from './enrolledCourse/enrolledCourse.module';
import { LiveClassesModule } from './liveclasses/liveclasses.module';
import { UserModule } from './user/user.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    PassportModule,
    JwtModule,
    StudentAuthModule,
    UserModule,
    EnrolledCourseModule,
    LiveClassesModule,
    CourseModule,
    RouterModule.register([
      {
        path: 'student',
        children: [
          {
            path: 'auth',
            module: StudentAuthModule,
          },
          {
            path: 'user',
            module: UserModule,
          },
          {
            path: 'enrolled-course',
            module: EnrolledCourseModule
          },
          {
            path: 'live-classes',
            module: LiveClassesModule
          },
          {
            path: 'course',
            module: CourseModule
          }
        ],
      },
    ]),
  ],
  controllers: [],
  exports: [JwtModule, PassportModule],
})
export class StudentModule {}

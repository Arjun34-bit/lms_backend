import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AdminAuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TestModule } from './test/test.module';
import { AssignmentModule } from './assignment/assignment.module';
import { MeetingModule } from './meeting/meeting.module';
import { CourseModule } from './course/course.module';
import { SubjectModule } from './subject/subject.module';
import { DepartmentModule } from './department/department.module';
import { AdminStudentModule } from './student/student.module';
import { InstructorModule } from '@modules/instructor/instructor.module';
import { AdminInstructorModule } from './instructor/instructor.module';

@Module({
    imports: [
        PrismaModule,
        AdminAuthModule,
        CategoryModule,
        TestModule,
        AssignmentModule,
        MeetingModule,
        CourseModule,
        SubjectModule,
        DepartmentModule,
        AdminStudentModule,
        AdminInstructorModule
        // LiveClassModule
    ],
})
export class AdminModule { }

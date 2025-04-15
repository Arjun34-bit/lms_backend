import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtParentAuthGuard } from '../auth/guards/jwt-parent.guard';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('parent/courses')
@UseGuards(JwtParentAuthGuard)
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Get(':studentId')
    getStudentCourses(
        @GetUser('id') parentId: string,
        @Param('studentId') studentId: string
    ) {
        return this.coursesService.getStudentCourses(parentId, studentId);
    }

    @Get(':studentId/schedules')
    getSchedules(
        @GetUser('id') parentId: string,
        @Param('studentId') studentId: string
    ) {
        return this.coursesService.getSchedules(parentId, studentId);
    }
}

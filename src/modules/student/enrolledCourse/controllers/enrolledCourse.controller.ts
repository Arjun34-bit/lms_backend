import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { EnrolledCourseService } from '../services/enrolledCourse.service';
import { GetUser } from 'src/common/decorators/user.decorator';
import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';

@Controller()
@UseGuards(JwtStudentAuthGuard)
export class EnrolledCourseController {
  constructor(
    private readonly enrolledCourseService: EnrolledCourseService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Get()
  async getEnrolledCourses(@GetUser() user: StudentJwtDto) {
    const data = await this.enrolledCourseService.getEnrolledCourses(user);
    return this.apiUtilsSevice.make_response(data);
  }

  @Get('single')
  async getSingleEnrolledCourse(
    @GetUser() user: StudentJwtDto,
    @Body('courseId') courseId: string,
  ) {
    const data = await this.enrolledCourseService.getSingleCourse(
      user,
      courseId,
    );
    return this.apiUtilsSevice.make_response(data);
  }
}

import { Body, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { CourseService } from '../services/course.service';
import JwtInstructorAuthGuard from '@modules/instructor/auth/guards/jwt-auth.guard';
import { CreateCourseDto } from '../dtos/createCourse.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { ApiPaginationResponseT } from '@utils/types';
import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';

@Controller()
@UseGuards(JwtInstructorAuthGuard)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() user: InstructorJwtDto,
    @UploadedFile() file: Multer.File
  ) {
    const data = await this.courseService.createCourse(createCourseDto, user, file);
    return this.apiUtilsSevice.make_response(data);
  }

  @Get('assigned-courses')
  async getAssignedCourses(
    @Query() queryDto: CourseFilterDto,
    @GetUser() user: InstructorJwtDto,
  ): Promise<ApiPaginationResponseT> {
    const data = await this.courseService.getAssignedCourses(user, queryDto);
    return this.apiUtilsSevice.make_pagination_response(
      data.courses,
      data.totalCount,
      data.limit,
    );
  }

  @Get('assigned-courses-stats')
  async assignedCoursesStats(@GetUser() user: InstructorJwtDto) {
    const data = await this.courseService.assignedCoursesStats(user);
    return this.apiUtilsSevice.make_response(data);
  }
}

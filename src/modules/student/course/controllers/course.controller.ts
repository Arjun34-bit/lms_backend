import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { CommonService } from '@modules/common/services/common.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiPaginationResponseT, ApiResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CourseService } from '../services/course.service';
import { Public } from 'src/common/decorators/public.decorator';
import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { BuyCourseDto } from '../dtos/buyCourse.dto';

@Controller()
@UseGuards(JwtStudentAuthGuard)
export class CourseController {
  constructor(
    private readonly commonService: CommonService,
    private readonly courseService: CourseService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Public()
  @Get('all-courses')
  async getCourses(
    @Query() queryDto: PaginationDto,
    @Query() filterDto: CourseFilterDto,
  ): Promise<ApiPaginationResponseT> {
    const data = await this.commonService.getCourses(queryDto, filterDto);
    return this.apiUtilsSevice.make_pagination_response(
      data.courses,
      data.totalCount,
      data.limit,
    );
  }

  @Post('buy-course')
  async buyCourse(
    @Body() dto: BuyCourseDto,
    @GetUser() user: StudentJwtDto,
  ): Promise<ApiResponseT> {
    const data = await this.courseService.buyCourse(
      user?.studentId,
      dto.courseId,
    );
    return this.apiUtilsSevice.make_response(data);
  }

  @Public()
  @Post('verify-payment')
  async verifyPayment(@Body() paymentData) {
    return this.courseService.verifyPayment(paymentData);
  }
}

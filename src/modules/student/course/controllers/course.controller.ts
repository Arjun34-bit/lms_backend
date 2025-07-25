import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { CommonService } from '@modules/common/services/common.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiPaginationResponseT, ApiResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CourseService } from '../services/course.service';
import { Public } from 'src/common/decorators/public.decorator';
import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';
import { BuyCourseDto } from '../dtos/buyCourse.dto';
import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { GetUser } from 'src/common/decorators/user.decorator';


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

  @Public()
  @Get('course-detail')
  async getCourseDetail(
    @Query() filterDto: CourseFilterDto,
    @Query('courseId') courseId: string,
  ): Promise<ApiResponseT> {
    const data = await this.commonService.getCoursesDetails(
      filterDto,
      courseId,
    );
    return this.apiUtilsSevice.make_response(data);
  }

  @Public()
  @Get('by-category')
  async getCourseByCategory(
    @Query() queryDto: PaginationDto,
    @Query('categoryId') categoryId: string,
  ): Promise<ApiResponseT> {
    const data = await this.commonService.getCourseByCategory(
      queryDto,
      categoryId,
    );
    return this.apiUtilsSevice.make_response(data);
  }

  // @Post('buy-course')
  // async buyCourse(
  //   @Body() dto: BuyCourseDto,
  //   @GetUser() user: StudentJwtDto,
  // ): Promise<ApiResponseT> {
  //   console.log(dto);
  //   const data = await this.courseService.buyCourse(user?.userId, dto.courseId);

  //   return this.apiUtilsSevice.make_response(data);
  // }

//   @Public()
//   @Post('verify-payment')
//   async verifyPayment(@Body() paymentData) {
//     return this.courseService.verifyPayment(paymentData);
//   @Get('getalltransaction/:studentId')
//   async getGroupedTransactions(@Param('studentId') studentId: string) {
//     return this.courseService.getAllTransactions(studentId);
//   }
 }

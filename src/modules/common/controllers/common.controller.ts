import { BadRequestException, Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { CommonService } from '../services/common.service';
import { ApiPaginationResponseT, ApiResponseT } from '@utils/types';
import { SubjectFilterDto } from '../dtos/subjectFilter.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CourseFilterDto } from '../dtos/courseFilter.dto';
import { ResendEmailVerificationLinkDto } from '../dtos/resendVerificationLink.dto';
import { FileLinkDto } from '../dtos/fileLink.dto';
import { Response } from 'express';
import { MinioService } from '../services/minio.service';
import { Public } from 'src/common/decorators/public.decorator';
import { GetUser } from 'src/common/decorators/user.decorator';
import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';
import { BuyCourseDto } from '@modules/student/course/dtos/buyCourse.dto';
import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';

@Controller('common')
export class CommonController {
  constructor(
    private readonly commonService: CommonService,
    private readonly minioservice: MinioService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Get('languages')
  async getLanguages(): Promise<ApiResponseT> {
    const data = await this.commonService.getLanguages();
    return this.apiUtilsSevice.make_response(data);
  }

  @Get('departments')
  async getDepartments(): Promise<ApiResponseT> {
    const data = await this.commonService.getDepartments();
    return this.apiUtilsSevice.make_response(data);
  }

  @Get('subjects')
  async getSubjects(
    @Query() queryDto: SubjectFilterDto,
  ): Promise<ApiResponseT> {
    const data = await this.commonService.getSubjects(queryDto);
    return this.apiUtilsSevice.make_response(data);
  }

  @Get('categories')
  async getCategories(): Promise<ApiResponseT> {
    const data = await this.commonService.getCategories();
    return this.apiUtilsSevice.make_response(data);
  }

  /**
   * Get all courses with filters
   * @param queryDto Pagination parameters (limit, pageNumber)
   * @param filterDto Course filters (categoryId, languageId, departmentId, subjectId, courseName, instructorName, minPrice, maxPrice)
   * @returns Paginated list of courses with total count
   */
  @Get('courses')
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

  @Post('resend-verification-link')
  async resendEmailVerificationLink(
    @Body() dto: ResendEmailVerificationLinkDto,
  ): Promise<ApiResponseT> {
    const data = await this.commonService.resendEmailVerificationLink(dto);
    return this.apiUtilsSevice.make_response(
      data,
      'Email verification sent successfully',
    );
  }

  @Get('master-data')
  async allMasterData() {
    const languages = await this.commonService.getLanguages();
    const departments = await this.commonService.getDepartments();
    const categories = await this.commonService.getCategories();
    return this.apiUtilsSevice.make_response({
      languages,
      departments,
      categories,
    });
  }

  @Get('image')
  async renderFile(@Query() dto: FileLinkDto, @Res() res: Response) {
    const fileStream = await this.commonService.getFileStream(dto);
    fileStream.pipe(res);
  }

  @Get('course')
  async getCourseById(@Query('courseId') courseId: string): Promise<ApiResponseT> {
    if (!courseId) {
      throw new BadRequestException('courseId query param is required');
    }
  
    const data = await this.commonService.getCourseById(courseId);
    return this.apiUtilsSevice.make_response(data);
  }

  @UseGuards(JwtStudentAuthGuard)
  @Post('buy-course')
  async buyCourse(
    @Body() dto: BuyCourseDto,
    @GetUser() user: StudentJwtDto,
  ): Promise<ApiResponseT> {
    console.log(dto);
    const data = await this.commonService.buyCourse(
      user?.studentId,
      dto.courseId,
    );

    return this.apiUtilsSevice.make_response(data);
  }

  @Public()
  @Post('verify-payment')
  async verifyPayment(@Body() paymentData) {
    return this.commonService.verifyPayment(paymentData);
  }
  
}

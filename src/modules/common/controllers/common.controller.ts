import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
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
}

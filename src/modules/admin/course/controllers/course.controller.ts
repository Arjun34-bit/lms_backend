import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from '../services/course.service';
import { CreateCourseDto } from '../dtos/createCourse.dto';
import { JwtAdminAuthGuard } from '@modules/admin/auth/guards/jwt-admin.guard';
import { ApiUtilsService } from '@utils/utils.service';
import { AdminJwtDto } from '@modules/common/dtos/admindto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { ApiPaginationResponseT } from '@utils/types';
import { Multer } from'multer';


@Controller('admin/courses')
@UseGuards(JwtAdminAuthGuard)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly apiUtilsService: ApiUtilsService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @GetUser() user: AdminJwtDto,
    @UploadedFile() file: Multer.File,
  ) {
    const data = await this.courseService.createCourse(createCourseDto, user, file);
    return this.apiUtilsService.make_response(data);
  }

  @Get()
  async getCourses(
    @Query() queryDto: CourseFilterDto,
  ): Promise<ApiPaginationResponseT> {
    const data = await this.courseService.getCourses(queryDto);
    return this.apiUtilsService.make_pagination_response(
      data.courses,
      data.totalCount,
      data.limit,
    );
  }
  @Get(':id')
  async getCourseById(@Param('id') id: string) {
    const data = await this.courseService.getCourseById(id);
    return this.apiUtilsService.make_response(data);
  }
}
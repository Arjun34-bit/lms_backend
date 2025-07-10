import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { CommonService } from '@modules/common/services/common.service';
import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiPaginationResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CourseService } from '../services/course.service';
import { Public } from 'src/common/decorators/public.decorator';
import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';


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

  @Get('getalltransaction/:studentId')
  async getGroupedTransactions(@Param('studentId') studentId: string) {
    return this.courseService.getAllTransactions(studentId);
  }
}

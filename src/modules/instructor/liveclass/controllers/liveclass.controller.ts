import JwtInstructorAuthGuard from '@modules/instructor/auth/guards/jwt-auth.guard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { LiveClassService } from '../service/liveclass.service';
import { ScheduleLiveClassDto } from '../dtos/scheduleLiveClass.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller()
@UseGuards(JwtInstructorAuthGuard)
export class LiveClassController {
  constructor(
    private readonly liveclassService: LiveClassService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Post('schedule')
  async scheduleLiveClass(
    @Body() dto: ScheduleLiveClassDto,
    @GetUser() user: InstructorJwtDto,
  ) {
    const data = await this.liveclassService.scheduleLiveClass(dto, user);
    return this.apiUtilsSevice.make_response(data);
  }

  @Get()
  async getLiveClass(
    @GetUser() user: InstructorJwtDto,
    @Query() queryDto: PaginationDto,
  ) {
    const data = await this.liveclassService.getLiveClass(user, queryDto);
    return this.apiUtilsSevice.make_pagination_response(
      data.data,
      data.totalCount,
      data.limit,
    );
  }
}

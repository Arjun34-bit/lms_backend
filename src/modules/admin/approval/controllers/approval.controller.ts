import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { ApiPaginationResponseT } from '@utils/types';
import JwtAdminAuthGuard from '@modules/admin/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ApprovalService } from '../services/approval.service';
import { InstructorApprovalDto } from '../dto/instructorApproval.dto';
import { ApiResponse } from '@utils/interfaces';
import { CourseApprovalDto } from '../dto/courseApproval.dto';

@Controller()
@UseGuards(JwtAdminAuthGuard)
export class AdminApprovalController {
  constructor(
    private readonly apiUtilsSevice: ApiUtilsService,
    private readonly approvalService: ApprovalService,
  ) {}

  @Get('pending-instructors')
  async getListOfPendingInstructors(
    @Query() queryDto: PaginationDto,
  ): Promise<ApiPaginationResponseT> {
    const data =
      await this.approvalService.getListOfPendingInstructors(queryDto);
    return this.apiUtilsSevice.make_pagination_response(
      data.pendingInstructors,
      data.totalCount,
      data.limit,
    );
  }

  @Patch('approve-or-reject-instructor')
  async approveOrRejectInstructor(
    @Body() dto: InstructorApprovalDto,
  ): Promise<ApiResponse> {
    const data = await this.approvalService.approveOrRejectInstructor(dto);
    return this.apiUtilsSevice.make_response(
      { approvalStatus: data.approvalStatus },
      data.message,
    );
  }

  @Get('pending-courses')
  async getListOfPendingCourses(
    @Query() queryDto: PaginationDto,
  ): Promise<ApiPaginationResponseT> {
    const data = await this.approvalService.getListOfPendingCourses(queryDto);
    return this.apiUtilsSevice.make_pagination_response(
      data.pendingCourses,
      data.totalCount,
      data.limit,
    );
  }

  @Patch('approve-or-reject-course')
  async approveOrRejectCourse(
    @Body() dto: CourseApprovalDto,
  ): Promise<ApiResponse> {
    const data = await this.approvalService.approveOrRejectCourse(dto);
    return this.apiUtilsSevice.make_response(
      { approvalStatus: data.approvalStatus },
      data.message,
    );
  }
}

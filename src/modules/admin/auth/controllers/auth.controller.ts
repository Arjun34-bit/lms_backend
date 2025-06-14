import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { AdminAuthService } from '../services/auth.service';
import { AdminLoginDto } from '../dto/login.dto';
import { AdminPhoneLoginDto } from '../dto/phone-login.dto';
import { ApiUtilsService } from '@utils/utils.service';
import { InstructorApprovalDto } from '../dto/instructor-approval.dto';
import { CourseApprovalDto } from '../dto/course-approval.dto';
import { JwtAdminAuthGuard } from '../guards/jwt-admin.guard';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private readonly adminAuthService: AdminAuthService,
    private readonly apiUtilsService: ApiUtilsService,
  ) {}

  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    const data = await this.adminAuthService.login(adminLoginDto);
    return this.apiUtilsService.make_response(data, 'Admin login successful');
  }

  @Post('login/phone')
  async loginWithPhone(@Body() phoneLoginDto: AdminPhoneLoginDto) {
    const data = await this.adminAuthService.loginWithPhoneNumber(phoneLoginDto);
    return this.apiUtilsService.make_response(data, 'Admin phone login successful');
  }


@UseGuards(JwtAdminAuthGuard)
  @Post('instructor/approve&decline')
  async approveInstructor(@Body() approvalDto: InstructorApprovalDto) {
    const data = await this.adminAuthService.approveInstructor(
      approvalDto.instructorId,
      approvalDto.approvalStatus,
    );
    return this.apiUtilsService.make_response(
      data,
      `Instructor ${approvalDto.approvalStatus} successfully`,
    );
  }
@UseGuards(JwtAdminAuthGuard)
  @Get('instructors/pending')
  async getPendingInstructors(@Query('limit') limit = 10, @Query('pageNumber') pageNumber = 1) {
    const data = await this.adminAuthService.getPendingInstructors(+limit, +pageNumber);
    return this.apiUtilsService.make_response(data, 'Pending instructors retrieved successfully');
  }

@UseGuards(JwtAdminAuthGuard)
  @Get('instructors/approved')
async getApprovedInstructors(@Query('limit') limit = 10, @Query('pageNumber') pageNumber = 1) {
  const data = await this.adminAuthService.getApprovedInstructors(+limit, +pageNumber);
  return this.apiUtilsService.make_response(data, 'Approved instructors retrieved successfully');
}

@UseGuards(JwtAdminAuthGuard)
  @Get('courses/pending')
  async getPendingCourses(@Query('limit') limit = 10, @Query('pageNumber') pageNumber = 1) {
    const data = await this.adminAuthService.getPendingCourses(+limit, +pageNumber);
    return this.apiUtilsService.make_response(data, 'Pending courses retrieved successfully');
  }

@UseGuards(JwtAdminAuthGuard)
  @Get('courses/approved')
  async getApprovedCourses(@Query('limit') limit = 10, @Query('pageNumber') pageNumber = 1) {
    const data = await this.adminAuthService.getApprovedCourses(+limit, +pageNumber);
    return this.apiUtilsService.make_response(data, 'Approved courses retrieved successfully');
  }

@UseGuards(JwtAdminAuthGuard)
  @Post('course/approve&decline')
  async approveCourse(@Body() approvalDto: CourseApprovalDto) {
    const data = await this.adminAuthService.approveCourse(
      approvalDto.courseId,
      approvalDto.approvalStatus,
    );
    return this.apiUtilsService.make_response(
      data,
      `Course ${approvalDto.approvalStatus} successfully`,
    );
  }
}

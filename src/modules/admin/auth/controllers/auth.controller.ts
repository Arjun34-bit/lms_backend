import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminAuthService } from '../services/auth.service';
import { AdminLoginDto } from '../dto/login.dto';
import { AdminPhoneLoginDto } from '../dto/phone-login.dto';
import { ApiUtilsService } from '@utils/utils.service';
import { InstructorApprovalDto } from '../dto/instructor-approval.dto';

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
}
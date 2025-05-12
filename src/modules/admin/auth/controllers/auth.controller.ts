import { Controller, Post, Body,  } from '@nestjs/common';
import { AdminAuthService } from '../services/auth.service';
import { AdminLoginDto } from '../dto/login.dto';
import { ApiUtilsService } from '@utils/utils.service'; // Assuming ApiUtilsService is in a shared utils path

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
}
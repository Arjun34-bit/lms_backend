import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import { AdminAuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller()
export class AdminAuthController {
  constructor(
    private readonly authService: AdminAuthService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseT> {
    const data = await this.authService.login(loginDto);
    return this.apiUtilsSevice.make_response(data);
  }
}

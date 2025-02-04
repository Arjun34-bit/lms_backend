import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { VerifyEmailDto } from '../dto/verifyEmail.dto';
import { Response } from 'express';
import { envConstant } from '@constants/index';

@Controller()
export class InstructorAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto): Promise<ApiResponseT> {
    const data = await this.authService.signup(signupDto);
    return this.apiUtilsSevice.make_response(
      data,
      'Signup Successfull. Please verify your email and wait for admin approval.',
    );
  }

  @Get('verify-email')
  async verifyEmail(@Query() queryDto: VerifyEmailDto, @Res() res: Response) {
    const data = await this.authService.verifyEmail(queryDto.token);
    return res.redirect(
      `${envConstant.CLIENT_BASE_URL}/instructor/verified?message=${data.message}`,
    );
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseT> {
    const data = await this.authService.login(loginDto);
    return this.apiUtilsSevice.make_response(data);
  }

  @Post('google-login')
  async googleLogin(@Body('idToken') idToken: string) {
    return this.authService.googleLogin(idToken);
  }
}

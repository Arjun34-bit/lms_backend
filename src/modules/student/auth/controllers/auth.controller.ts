import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto, LoginWithPhoneNumberDto } from '../dto/login.dto';
import { VerifyEmailDto } from '@modules/student/auth/dto/verifyEmail.dto';
import { Response } from 'express';
import { envConstant } from '@constants/index';

@Controller()
export class StudentAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Post('signup-with-email')
  async signupWithEmail(@Body() signupDto: SignUpDto): Promise<ApiResponseT> {
    const data = await this.authService.signupWithEmail(signupDto);
    return this.apiUtilsSevice.make_response(
      data,
      'Signup Successfull. Please verify your email',
    );
  }

  @Post('login-with-phone-number')
  async loginWithPhoneNumber(@Body() body: LoginWithPhoneNumberDto) {
    const data = await this.authService.loginWithPhoneNumber(body.idToken);
    return this.apiUtilsSevice.make_response(data);
  }

  @Post('login-with-email')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseT> {
    const data = await this.authService.login(loginDto);
    return this.apiUtilsSevice.make_response(data);
  }

  @Get('verify-email')
  async verifyEmail(@Query() queryDto: VerifyEmailDto, @Res() res: Response) {
    const data = await this.authService.verifyEmail(queryDto.token);
    return res.redirect(`${envConstant.CLIENT_BASE_URL}/student/verified?message=${data.message}`)
  }


}

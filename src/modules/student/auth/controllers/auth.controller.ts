import { Body, Controller, Post, Query } from '@nestjs/common';
import { ApiResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dto/signup.dto';
import { LoginDto, LoginWithPhoneNumberDto } from '../dto/login.dto';

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
    const data = this.authService.loginWithPhoneNumber(body.idToken);
    return this.apiUtilsSevice.make_response(data);
  }

  @Post('login-with-email')
  async login(@Body() loginDto: LoginDto): Promise<ApiResponseT> {
    const data = await this.authService.login(loginDto);
    return this.apiUtilsSevice.make_response(data);
  }

  @Post('verify-email')
  async verifyEmail(@Query('oobCode') oobCode: string) {
    const data = await this.authService.verifyEmail(oobCode);
    return this.apiUtilsSevice.make_response(null, data.message);
  }

  @Post('google-login')
  async googleLogin(@Body('idToken') idToken: string) {
    return this.authService.googleLogin(idToken);
  }
}

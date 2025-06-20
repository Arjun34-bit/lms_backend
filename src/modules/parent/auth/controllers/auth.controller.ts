import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ParentAuthService } from '../services/auth.service';
import {
  ConnectChildrenDto,
  DisconnectChildrenDto,
  LoginWithPhoneNumberDto,
  LoginWithGoogleDto,
  ParentSigninDto,
  ParentSignupDto,
} from '../dto/auth.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { JwtParentAuthGuard } from '../guards/jwt-parent.guard';
import { envConstant } from '@constants/index';
import { VerifyEmailDto } from '../dto/verifyemail.dto';
import { Response } from 'express';
import { ApiUtilsService } from '@utils/utils.service';
import { BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Put ,Patch } from '@nestjs/common';
import { UpdateProfileDto } from '../dto/auth.dto'; // adjust path to where it's defined

@Controller('parent/auth')
export class ParentAuthController {
  constructor(
    private readonly authService: ParentAuthService,
    private readonly apiUtilsSevice: ApiUtilsService
  ) {}

  @Post('signup')
  async signup(@Body() dto: ParentSignupDto) {
    return this.authService.signup(dto);
  }

@Post('signin')
async signin(@Body() dto: ParentSigninDto) {
  return this.authService.signin(dto);
}



  @UseGuards(JwtParentAuthGuard)
  @Post('connect-children')
  async connectChildren(
    @GetUser('id') parentId: string,
    @Body() dto: ConnectChildrenDto
  ) {
    return this.authService.connectChildren(parentId, dto);
  }

  @UseGuards(JwtParentAuthGuard)
  @Post('disconnect-children')
  async disconnectChildren(
    @GetUser('id') parentId: string,
    @Body() dto: DisconnectChildrenDto
  ) {
    return this.authService.disconnectChildren(parentId, dto);
  }

  @UseGuards(JwtParentAuthGuard)
  @Get('children')
  async getChildren(@GetUser('id') parentId: string) {
    return this.authService.getChildren(parentId);
  }

  @Get('verify-email')
  async verifyEmail(@Query() queryDto: VerifyEmailDto, @Res() res: Response) {
    const data = await this.authService.verifyEmail(queryDto.token);
    return res.redirect(
      `${envConstant.CLIENT_BASE_URL}/parent/verified?message=${data.message}`
    );
  }
@Post('signup-with-google')
async signupWithGoogle(@Body('token') idToken: string) {
  if (!idToken) {
    throw new BadRequestException('Token is required');
  }
  return this.authService.signupWithGoogle(idToken);
}
@Post('login-with-google')
async loginWithGoogle(@Body('token') idToken: string) {
  if (!idToken) {
    throw new BadRequestException('Token is required');
  }
  return this.authService.loginWithGoogle(idToken);
}



@Post('login-with-phone')

async loginWithPhone(@Body('token') idToken: string) {
  if (!idToken) {
    throw new BadRequestException('Token is required');
  }

  const result = await this.authService.loginWithPhone(idToken);

  // ✅ Check what’s being returned
  console.log('Result:', result);

  return result;
}


@Put('profile')
@UseGuards(AuthGuard('parent-jwt'))
async updateProfile(@GetUser() user: any, @Body() dto: UpdateProfileDto) {
  return this.authService.updateParentProfile(user.parentId, dto);
}

  @Get('login-with-google')
  async googleLoginPage(@Res() res: Response) {
    // Replace with your actual hosted Google login page URL
    return res.redirect('https://your-firebase-google-login-page-url.com');
  }

  // Redirect WebView to Firebase Phone login (or your hosted Phone login page)
  @Get('login-with-phone')
  async phoneLoginPage(@Res() res: Response) {
    // Replace with your actual hosted Phone login page URL
    return res.redirect('https://your-firebase-phone-login-page-url.com');
  }
  @Post('google-login')
  async googleLogin(@Body('idToken') idToken: string) {
    if (!idToken) {
      throw new BadRequestException('ID token is required');
    }

    const user = await this.authService.verifyGoogleIdToken(idToken);
    return { message: 'Login successful', user };
  }

  @Get('app-login-with-phone')
  async appphoneLoginPage(@Res() res: Response) {
    return res.send('Phone login test successful');
  }


}


 
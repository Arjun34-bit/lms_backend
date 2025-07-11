
 

import {  Body,  Controller,  Post,  UseGuards,  Get,  Param,  Query,  Res,} from '@nestjs/common';

import { ParentAuthService } from '../services/auth.service';
import {  ConnectChildrenDto,  DisconnectChildrenDto,  LoginWithPhoneNumberDto,  LoginWithGoogleDto,  ParentSigninDto, GoogleLoginDto ,ParentSignupDto,
} from '../dto/auth.dto';
import { LoginWithGoogleDtoapp } from '../dto/auth.dto';
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
import { GoogleService } from '@modules/common/services/google/google.service';
import { JwtService } from '@nestjs/jwt';
import { UpdateParentProfileDto } from '../dto/auth.dto'; // adjust path to where it's defined
import { OAuth2Client } from 'google-auth-library';
declare global {
  namespace Express {
    interface Request {
      user?: any; // or a specific type like `User & { googleId: string }`
    }
  }
}


@Controller('parent/auth')
export class ParentAuthController {
  constructor(
    private readonly authService: ParentAuthService,
    private readonly apiUtilsSevice: ApiUtilsService,
  private readonly apiUtilsService: ApiUtilsService,
    private readonly googleService: GoogleService,
      private readonly jwtService: JwtService,
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





    @UseGuards(JwtParentAuthGuard)
    @Get('profile')
    async getProfile(@GetUser() user: any) {
        const data = await this.authService.getProfile(user);
        return this.apiUtilsSevice.make_response(data);
    }

    @UseGuards(JwtParentAuthGuard)
    @Put('profile')
    async updateProfile(
        @GetUser() user: any,
        @Body() dto: UpdateParentProfileDto
    ) {
        const data = await this.authService.updateProfile(user, dto);
        return this.apiUtilsSevice.make_response(data);
    }


  // Redirect WebView to Firebase Phone login (or your hosted Phone login page)
  @Get('login-with-phone')
  async phoneLoginPage(@Res() res: Response) {
    // Replace with your actual hosted Phone login page URL
    return res.redirect('https://your-firebase-phone-login-page-url.com');
  }

     @Post('google-login')
    async googleLogin(@Body() dto: GoogleLoginDto) {
        const data = await this.authService.googleLogin(dto.token);
        return this.apiUtilsSevice.make_response(data);
    }

  @Get('app-login-with-phone')
  async appphoneLoginPage(@Res() res: Response) {
    return res.send('Phone login test successful');
  }

@Get('google/auth-url')
getGoogleAuthUrl(@Res() res: Response) {
  const url = this.googleService.generateAuthUrl();
  return res.status(200).json({ url }); // ✅ Must end response
}


  // 2. Accept code and exchange tokens
 @Post('login-with-google-from-app')
async loginWithGoogleFromApp(@Body() dto: LoginWithGoogleDtoapp) {
  const result = await this.googleService.exchangeCode(dto.code);

  const parent = await this.authService.findOrCreateParentUserFromGoogle(result.profile);

  const token = this.jwtService.sign({
    id: parent.id,
    email: result.profile.email,
    role: 'parent',
  });

  return {
    token,
    parent,
  };
}


@Get('google/callback')
async googleRedirect(@Query('code') code: string, @Res() res: Response) {
  try {
    if (!code) {
      return res.status(400).json({ message: 'No code provided' });
    }

    // Step 1: Exchange code for token + profile
    const result = await this.googleService.exchangeCode(code);

    // Step 2: Get or create user in DB
    const parent = await this.authService.findOrCreateParentUserFromGoogle(result.profile);

    // Step 3: Sign JWT for app session
    const token = this.jwtService.sign({
      id: parent.userId,
      email: result.profile.email,
      role: 'parent',
    });

    // Step 4: Redirect to MAUI app with token
    const redirectUrl = `myapp://auth-success?token=${token}`;
    return res.redirect(redirectUrl);

  } catch (err) {
    console.error('❌ Google callback error:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error',
    });
  }
}
@Post('login-with-phone-app')

async loginWithPhoneapp(@Body('token') idToken: string) {
  if (!idToken) {
    throw new BadRequestException('Token is required');
  }

  const result = await this.authService.loginWithPhone(idToken);

  // ✅ Check what’s being returned
  console.log('Result:', result);

  return result;
}
}

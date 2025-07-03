import { Body, Controller, Post, UseGuards, Get, Param, Query, Res, Put } from '@nestjs/common';
import { ParentAuthService } from '../services/auth.service';
import { ConnectChildrenDto, DisconnectChildrenDto, LoginWithPhoneNumberDto, ParentSigninDto, ParentSignupDto, UpdateParentProfileDto, GoogleLoginDto } from '../dto/auth.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { JwtParentAuthGuard } from '../guards/jwt-parent.guard';
import { envConstant } from '@constants/index';
import { VerifyEmailDto } from '../dto/verifyemail.dto';
import { Response } from 'express';
import { ApiUtilsService } from '@utils/utils.service';

@Controller('parent/auth')
 export class ParentAuthController {
    constructor(
        private readonly authService: ParentAuthService,
        private readonly apiUtilsSevice: ApiUtilsService,
    ) {}

    @Post('signup')
    async signup(@Body() dto: ParentSignupDto) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    async signin(@Body() dto: ParentSigninDto) {
        return this.authService.signin(dto);
    }

    @Post('google-login')
    async googleLogin(@Body() dto: GoogleLoginDto) {
        const data = await this.authService.googleLogin(dto.token);
        return this.apiUtilsSevice.make_response(data);
    }
    @Post('login-with-phone-number')
    async loginWithPhoneNumber(@Body() body: LoginWithPhoneNumberDto) {
      const data = this.authService.loginWithPhoneNumber(body.idToken);
      return this.apiUtilsSevice.make_response(data);
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
      return res.redirect(`${envConstant.CLIENT_BASE_URL}/parent/verified?message=${data.message}`)
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
}

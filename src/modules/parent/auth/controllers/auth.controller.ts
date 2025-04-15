import { Body, Controller, Post, UseGuards, Get, Param } from '@nestjs/common';
import { ParentAuthService } from '../services/auth.service';
import { ConnectChildrenDto, ParentSigninDto, ParentSignupDto } from '../dto/auth.dto';
import { GetUser } from 'src/common/decorators/user.decorator';
import { JwtParentAuthGuard } from '../guards/jwt-parent.guard';

@Controller('parent/auth')
export class ParentAuthController {
    constructor(private readonly authService: ParentAuthService) { }

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
    @Get('children')
    async getChildren(@GetUser('id') parentId: string) {
        return this.authService.getChildren(parentId);
    }
}

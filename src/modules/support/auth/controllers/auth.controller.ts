import { Controller, Post, Body } from '@nestjs/common';
import { SupportAuthService } from '../services/auth.service';
import { SupportLoginDto } from '../dto/login.dto';

@Controller('support')
export class SupportAuthController {
    constructor(private readonly authService: SupportAuthService) {}

    @Post('login')
    async login(@Body() loginDto: SupportLoginDto) {
        return this.authService.login(loginDto);
    }
}
import { Controller, Post, Body, UseGuards, Get, Query, ParseIntPipe } from '@nestjs/common';
import { AdminSupportService } from '../services/support.service';
import { CreateSupportDto } from '../dto/create-support.dto';
import { JwtAdminAuthGuard } from '@modules/admin/auth/guards/jwt-admin.guard';

@Controller('admin/support')
@UseGuards(JwtAdminAuthGuard)
export class AdminSupportController {
    constructor(private readonly supportService: AdminSupportService) {}

    @Post('register')
    async createSupport(@Body() createSupportDto: CreateSupportDto) {
        return this.supportService.createSupport(createSupportDto);
    }

    @Get()
    async getAllSupport(
        @Query('page', new ParseIntPipe()) page = 1,
        @Query('itemsPerPage', new ParseIntPipe()) itemsPerPage = 10,
    ) {
        return this.supportService.getAllSupport(page, itemsPerPage);
    }

    
}
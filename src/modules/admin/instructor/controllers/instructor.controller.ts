import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminInstructorService } from '../services/instructor.service';
import { CreateInstructorDto } from '../dto/create-instructor.dto';
import { JwtAdminAuthGuard } from '../../auth/guards/jwt-admin.guard';
import { Multer } from 'multer';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin/instructors')
export class AdminInstructorController {
    constructor(private readonly adminInstructorService: AdminInstructorService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createInstructor(
        @Body() createInstructorDto: CreateInstructorDto,
        @UploadedFile() file?: Multer.File
    ) {
        return this.adminInstructorService.createInstructor(createInstructorDto, file);
    }

    @Get()
    async getAllInstructors(
        @Query('page') page: number = 1,
        @Query('itemsPerPage') itemsPerPage: number = 10
    ) {
        return this.adminInstructorService.getAllInstructors(+page, +itemsPerPage);
    }

    @Get(':id')
    async getInstructorById(@Param('id') id: string) {
        return this.adminInstructorService.getInstructorById(id);
    }

    @Delete(':id')
    async deleteInstructor(@Param('id') id: string) {
        return this.adminInstructorService.deleteInstructor(id);
    }
}

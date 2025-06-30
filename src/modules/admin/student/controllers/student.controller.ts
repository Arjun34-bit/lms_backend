import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AdminStudentService } from '../services/student.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { JwtAdminAuthGuard } from '../../auth/guards/jwt-admin.guard';
import { Multer } from 'multer';


@UseGuards(JwtAdminAuthGuard)
@Controller('admin/students')
export class AdminStudentController {
    constructor(private readonly adminStudentService: AdminStudentService) { }    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async createStudent(
        @Body() createStudentDto: CreateStudentDto,
        @UploadedFile() file?: Multer.File
    ) {
        return this.adminStudentService.createStudent(createStudentDto, file);
    }

    @Get()
    async getAllStudents(
        @Query('page') page: number = 1,
        @Query('itemsPerPage') itemsPerPage: number = 10
    ) {
        return this.adminStudentService.getAllStudents(+page, +itemsPerPage);
    }

    @Get(':id')
    async getStudentById(@Param('id') id: string) {
        return this.adminStudentService.getStudentById(id);
    }

    @Delete(':id')
    async deleteStudent(@Param('id') id: string) {
        return this.adminStudentService.deleteStudent(id);
    }
}

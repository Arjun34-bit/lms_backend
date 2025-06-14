import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { JwtAdminAuthGuard } from '../../auth/guards/jwt-admin.guard';

@Controller('admin/subjects')
@UseGuards(JwtAdminAuthGuard)
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) {}

    @Post()
    async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
        return this.subjectService.createSubject(createSubjectDto);
    }

    @Get()
    async getAllSubjects() {
        return this.subjectService.getAllSubjects();
    }

    @Get(':id')
    async getSubjectById(@Param('id') id: string) {
        return this.subjectService.getSubjectById(id);
    }

    @Delete(':id')
    async removeSubject(@Param('id') id: string) {
        return this.subjectService.removeSubject(id);
    }
}
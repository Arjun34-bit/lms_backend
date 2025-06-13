import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto } from '../dto/create-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const department = await this.prisma.department.findUnique({
      where: { id: createSubjectDto.departmentId },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const subject = await this.prisma.subject.create({
      data: {
        name: createSubjectDto.name,
        description: createSubjectDto.description,
        departmentId: createSubjectDto.departmentId,
      },
    });

    return {
      message: 'Subject created successfully',
      data: subject,
    };
  }

  async getAllSubjects() {
    return this.prisma.subject.findMany({
      include: {
        department: true,
      },
    });
  }

  async getSubjectById(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        department: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async removeSubject(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    await this.prisma.subject.delete({
      where: { id },
    });

    return {
      message: 'Subject deleted successfully',
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAssignmentDto: CreateAssignmentDto) {
    const { subjectName, assignmentName, questions } = createAssignmentDto;

    // First check if subject exists
    const subject = await this.prisma.subject.findFirst({
      where: { name: subjectName },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with name ${subjectName} not found`);
    }

    return this.prisma.assignment.create({
      data: {
        name: assignmentName,
        subjectId: subject.id,
        question: questions.map((q) => q.question).join('\n'),
      },
      include: {
        subject: true,
      },
    });
  }

  async findAll() {
    return this.prisma.assignment.findMany({
      include: {
        subject: true,
      },
    });
  }

  async findOne(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
      include: {
        subject: true,
      },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateAssignmentDto) {
    const { assignmentName, questions } = updateAssignmentDto;

    const existingAssignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!existingAssignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    const updateData: any = {};

    if (assignmentName) {
      updateData.name = assignmentName;
    }

    if (questions) {
      updateData.question = questions.map((q) => q.question).join('\n');
    }

    return this.prisma.assignment.update({
      where: { id },
      data: updateData,
      include: {
        subject: true,
      },
    });
  }

  async remove(id: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    return this.prisma.assignment.delete({
      where: { id },
      include: {
        subject: true,
      },
    });
  }
}

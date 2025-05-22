import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Injectable()
export class TestService {
  constructor(private readonly prisma: PrismaService) {}
 
  async create(createTestDto: CreateTestDto) {
    const { subjectName, testNumber, questions } = createTestDto;

    // First check if subject exists
    const subject = await this.prisma.subject.findFirst({
      where: { name: subjectName }
    });

    if (!subject) {
      throw new NotFoundException(`Subject with name ${subjectName} not found`);
    }

    // Create the test with questions
    return this.prisma.test.create({
      data: {
        subjectId: subject.id,
        TestNo: testNumber.toString(),
        question: questions.map(q => q.question).join('\n')
      },
      include: {
        subject: true
      }
    });
  }

  async findAll() {
    return this.prisma.test.findMany({
      include: {
        subject: true
      }
    });
  }

  async findOne(id: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
      include: {
        subject: true
      }
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    return test;
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    const { subjectName, testNumber, questions } = updateTestDto;

    // Check if test exists
    const existingTest = await this.prisma.test.findUnique({
      where: { id }
    });

    if (!existingTest) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    // If subject name is provided, verify it exists
    let subjectId = undefined;
    if (subjectName) {
      const subject = await this.prisma.subject.findFirst({
        where: { name: subjectName }
      });

      if (!subject) {
        throw new NotFoundException(`Subject with name ${subjectName} not found`);
      }
      subjectId = subject.id;
    }    // Update test
    const updateData: any = {};
    
    if (subjectId) {
      updateData.subjectId = subjectId;
    }
    
    if (testNumber !== undefined) {
      updateData.TestNo = testNumber.toString();
    }
    
    if (questions) {
      updateData.question = questions.map(q => q.question).join('\n');
    }

    return this.prisma.test.update({
      where: { id },
      data: updateData,
      include: {
        subject: true
      }
    });
  }

  async remove(id: string) {
    // Check if test exists
    const test = await this.prisma.test.findUnique({
      where: { id }
    });

    if (!test) {
      throw new NotFoundException(`Test with ID ${id} not found`);
    }

    // Delete test
    return this.prisma.test.delete({
      where: { id },
      include: {
        subject: true
      }
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto } from '../dto/create-department.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto) {
    const { name, description } = createDepartmentDto;
  
    const existing = await this.prisma.department.findUnique({
      where: { name },
    });
  
    if (existing) {
      throw new Error('DEPARTMENT_EXISTS');
    }
  
    return this.prisma.department.create({
      data: {
        name,
        description,
      },
    });
  }
  
  

  async findAll() {
    return this.prisma.department.findMany();
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({ where: { id } });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const existing = await this.prisma.department.findFirst({
      where: {
        name: updateDepartmentDto.name,
        NOT: { id }, // exclude current record
      },
    });
  
    if (existing) {
      throw new Error('DEPARTMENT_EXISTS');
    }
  
    return this.prisma.department.update({
      where: { id },
      data: updateDepartmentDto,
    });
  }
  

  async remove(id: string) {
    const department = await this.prisma.department.findUnique({ where: { id } });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return this.prisma.department.delete({ where: { id } });
  }
}
 
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { departmentSeedData } from './data/department.seed';

@Injectable()
export class DepartmentSeederService {
  private readonly logger = new Logger(DepartmentSeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async departmentSeed() {
    const departmentNames: string[] = [];
    for (const department of departmentSeedData) {
      departmentNames.push(department.name);
    }

    // Fetch existing departments from the database
    const departmentThatExists = await this.prisma.department.findMany({
      where: {
        name: {
          in: departmentNames,
        },
      },
      select: {
        name: true,
      },
    });
    // Extract the names of existing departments
    const existingDepartmentNames = await Promise.all(
      departmentThatExists.map(async (dept) => dept.name),
    );

    // Prepare the list of departments to insert
    const departmentToInsert: { name: string; description: string }[] = [];
    for (const department of departmentSeedData) {
      if (!existingDepartmentNames.includes(department.name)) {
        departmentToInsert.push({
          name: department.name,
          description: department.description,
        });
      }
    }

    // Insert the missing departments
    if (departmentToInsert.length > 0) {
      await this.prisma.$transaction([
        this.prisma.department.createMany({
          data: departmentToInsert,
        })
      ])
      this.logger.log('Inserted department seed data');
    }
  }
}

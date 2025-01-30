import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { subjectSeedData } from './data/subject.seed';

@Injectable()
export class SubjectSeederService {
  private readonly logger = new Logger(SubjectSeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async subjectSeed() {
    // Fetch all departments to link subjects
    const departments = await this.prisma.department.findMany({
      select: { id: true, name: true },
    });

    // Map department names to IDs
    const departmentMap = new Map(
      departments.map((dept) => [dept.name, dept.id]),
    );

    const subjectToInsert: {
      name: string;
      description: string;
      departmentId: string;
    }[] = [];

    for (const subject of subjectSeedData) {
      const departmentId = departmentMap.get(subject.departmentName);
      if (departmentId) {
        subjectToInsert.push({
          name: subject.name,
          description: subject.description,
          departmentId: departmentId,
        });
      }
    }

    // Check for existing subjects
    const existingSubjects = await this.prisma.subject.findMany({
      where: {
        name: {
          in: subjectToInsert.map((subj) => subj.name),
        },
      },
      select: { name: true },
    });

    const existingSubjectNames = existingSubjects.map((subj) => subj.name);

    // Filter out subjects that already exist
    const newSubjects = subjectToInsert.filter(
      (subj) => !existingSubjectNames.includes(subj.name),
    );

    // Insert new subjects
    if (newSubjects.length > 0) {
      await this.prisma.subject.createMany({
        data: newSubjects,
      });
      this.logger.log("Subject seed data inserted")
    }
  }
}

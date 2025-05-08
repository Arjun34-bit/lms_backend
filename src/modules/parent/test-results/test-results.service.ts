import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TestResultsService {
    constructor(private prisma: PrismaService) { }

    async getResults(parentId: string, studentId: string) {
        return this.prisma.testResult.findMany({
            where: {
                studentId,
                student: { parentId }
            },
            include: {
                course: true
            }
        });
    }

    async getProgress(parentId: string, studentId: string) {
        return this.prisma.testResult.groupBy({
            by: ['courseId'],
            where: {
                studentId,
                student: { parentId }
            },
            // _avg: {
            //     marks: true
            // },
            _count: {
                id: true
            }
        });
    }
}

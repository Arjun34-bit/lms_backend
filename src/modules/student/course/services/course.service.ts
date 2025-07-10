import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {

  constructor(private readonly prisma: PrismaService) {
  
  }
  async getAllTransactions(studentId: string) {
    const [pending, completed] = await this.prisma.$transaction([
      this.prisma.courseBuy.findMany({
        where: {
          studentId,
          status: 'PENDING',
        },
        include: {
          course: true,
        },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.courseBuy.findMany({
        where: {
          studentId,
          status: 'COMPLETED',
        },
        include: {
          course: true,
        },
        orderBy: { created_at: 'desc' },
      }),
    ]);
  
    return { pending, completed };
  }
  

 
}

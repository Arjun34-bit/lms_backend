import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async getNotifications(parentId: string, studentId: string) {
        return this.prisma.notification.findMany({
            where: {
                OR: [
                    { userId: parentId },
                    {
                        userId: studentId,
                        user: {
                            student: { parentId }
                        }
                    }
                ]
            },
            orderBy: { created_at: 'desc' }
        });
    }
}

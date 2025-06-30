// import { Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class NotificationsService {
//     constructor(private prisma: PrismaService) { }

//     async getNotifications(parentId: string, studentId: string) {
//         return this.prisma.notification.findMany({
//             where: {
//                 OR: [
//                     { userId: parentId },
//                     {
//                         userId: studentId,
//                         user: {
//                             student: { parentId }
//                         }
//                     }
//                 ]
//             },
//             orderBy: { created_at: 'desc' }
//         });
//     }
// }


import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(parentId: string, studentId: string) {
    const parentNotifications = await this.prisma.notification.findMany({
      where: {
        userId: parentId,
      },
    });

    const studentNotifications = await this.prisma.notification.findMany({
      where: {
        userId: studentId,
        user: {
          student: {
            parentId: parentId,
          },
        },
      },
    });

    return [...parentNotifications, ...studentNotifications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}

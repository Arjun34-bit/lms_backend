import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AttendanceService {
    constructor(private prisma: PrismaService) { }

    async getAttendance(parentId: string, studentId: string) {
        return this.prisma.liveClassAttendance.findMany({
            where: {
                studentId,
                student: { parentId }
            },
            include: {
                liveClass: {
                    include: { course: true }
                }
            }
        }); 
    }

    async getParticipation(parentId: string, studentId: string) {
        const [totalClasses, attendedClasses] = await Promise.all([
            this.prisma.liveClass.count({
                where: {
                    course: {
                        studentCourseEnrolled: {
                            some: { studentId }
                        }
                    }
                }
            }),
            this.prisma.liveClassAttendance.count({
                where: { studentId }
            })
        ]);

        return {
            totalClasses,
            attendedClasses,
            participationPercentage: totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0
        };
    }
}

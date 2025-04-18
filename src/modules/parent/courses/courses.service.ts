import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async getStudentCourses(parentId: string, studentId: string) {
        await this.validateStudent(parentId, studentId);
        return this.prisma.studentCourseEnrolled.findMany({
            where: { studentId: studentId.trim() },
            include: {
                course: {
                    include: {
                        subject: true,
                        liveClasses: true
                    }
                }
            }
        });
    }

    async getSchedules(parentId: string, studentId: string) {
        await this.validateStudent(parentId, studentId);
        return this.prisma.liveClass.findMany({
            where: {
                course: {
                    studentCourseEnrolled: {
                        some: { studentId: studentId.trim() }
                    }
                }
            },
            include: {
                course: true,
                instructor: {
                    include: { user: true }
                }
            }
        });
    }

    private async validateStudent(parentId: string, studentId: string) {
        const student = await this.prisma.student.findFirst({
            where: {
                id: studentId.trim(),
                parentId: parentId.trim()
            }
        });
        if (!student) throw new NotFoundException('Student not found');
        return student;
    }
}

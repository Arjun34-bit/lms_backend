import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { RoleEnum } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Multer } from 'multer';


@Injectable()
export class AdminStudentService {
  constructor(private prisma: PrismaService) {}

  async createStudent(createStudentDto: CreateStudentDto, file?: Multer.File) {
    try {
      const { name, email, phoneNumber, password, address, class: studentClass, parentId } = createStudentDto;
      
      let imageId: string | undefined;
      if (file) {
        // Save the image to Files table
        const newFile = await this.prisma.files.create({
          data: {
            bucketName: 'students',
            objectKey: `${Date.now()}-${file.originalname}`,
            fileType: 'image'
          }
        });
        imageId = newFile.id;
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      return this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.create({
          data: {      
                  name,
            email,
            phoneNumber,
            password: hashedPassword,
            role: RoleEnum.student,
            verified: true, // Admin created students are automatically verified
            ...(address ? { address } : {}),
          },
        });

        const studentData: any = {
          userId: user.id,
          class: studentClass,
          ...(imageId ? { imageId } : {})
        };

        if (parentId && parentId.trim() !== '') {
          studentData.parentId = parentId;
        }

        const student = await prisma.student.create({
          data: studentData,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                address: true,
                role: true,
                created_at: true,
                updated_at: true,
              },
            },
          },
        });

        return student;
      });
    } catch (error) {
      // 👇 Log detailed error only in server logs
      console.error('Server Error:', error);

      // 👇 Throw a friendly message
      throw new InternalServerErrorException('Something went wrong. Please try again later.');
    }
  }

  async getAllStudents(pageNumber = 1, limit = 10) {
    try {
      // Validate and sanitize input parameters
      const page = Math.max(1, Number(pageNumber));
      const itemsPerPage = Math.max(1, Math.min(100, Number(limit))); // Cap at 100 items per page
      const skip = (page - 1) * itemsPerPage;

      // Fetch students and total count in parallel for better performance
      const [students, total] = await Promise.all([
        this.prisma.student.findMany({
          skip,
          take: itemsPerPage,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
                address: true,
                role: true,
                created_at: true,
                updated_at: true,
              },
            },
            parent: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
          orderBy: {
            created_at: 'desc',
          },
        }),
        this.prisma.student.count(),
      ]);

      // Calculate pagination metadata
      const totalPages = Math.ceil(total / itemsPerPage);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      // Return formatted response with enhanced metadata
      return {
        success: true,
        data: students,
        meta: {
          total,
          currentPage: page,
          itemsPerPage,
          totalPages,
          hasNextPage,
          hasPreviousPage,
        },
      };
    } catch (error) {
      console.error('Error fetching students:', error);
      throw new InternalServerErrorException('Failed to fetch students. Please try again later.');
    }
  }

  async getStudentById(id: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              address: true,
              role: true,
              created_at: true,
              updated_at: true,
            },
          },
          parent: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  phoneNumber: true,
                },
              },
            },
          },
        },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      return student;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Server Error:', error);
      throw new InternalServerErrorException('Error fetching student');
    }
  }

  async deleteStudent(id: string) {
    try {
      const student = await this.prisma.student.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      // Using transaction to delete both student and user
      await this.prisma.$transaction(async (prisma) => {
        // First delete the student
        await prisma.student.delete({
          where: { id },
        });

        // Then delete the associated user
        await prisma.user.delete({
          where: { id: student.userId },
        });
      });

      return { message: 'Student deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Server Error:', error);
      throw new InternalServerErrorException('Error deleting student');
    }
  }
}

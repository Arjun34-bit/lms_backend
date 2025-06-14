import { Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInstructorDto } from '../dto/create-instructor.dto';
import { RoleEnum, AdminApprovalEnum } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Multer } from 'multer';

@Injectable()
export class AdminInstructorService {
    constructor(private prisma: PrismaService) { }    async createInstructor(createInstructorDto: CreateInstructorDto, file?: Multer.File) {
        try {
            const { name, email, password, phoneNumber, address, subjects, departments, imageId } = createInstructorDto;

            // Check if email already exists
            const existingUser = await this.prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                throw new ConflictException('Email already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            return this.prisma.$transaction(async (prisma) => {
                // Create user first
                const user = await prisma.user.create({
                    data: {
                        name,
                        email,
                        phoneNumber,
                        password: hashedPassword,
                        role: RoleEnum.instructor,
                        verified: true, // Admin created instructors are automatically verified
                        ...(address ? { address } : {}),
                        ...(imageId ? { imageId } : {})
                    },
                });

                // Create instructor with subjects and departments
                const instructor = await prisma.instructor.create({
                    data: {
                        userId: user.id,
                        approvalStatus: AdminApprovalEnum.approved, // Auto approve when created by admin
                        ...(departments?.length > 0 && {
                            departmentId: departments[0] // Assign the first department as primary department
                        }),
                        ...(subjects ? {
                            instructorSubject: {
                                create: subjects.map(subjectId => ({
                                    subject: { connect: { id: subjectId } }
                                }))
                            }
                        } : {})
                    },
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
                            }
                        },
                        department: true,
                        instructorSubjects: {
                            include: {
                                subject: true
                            }
                        }
                    }
                });

                return instructor;
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            console.error('Server Error:', error);
            throw new InternalServerErrorException('Error creating instructor. Please try again later.');
        }
    }

    async getAllInstructors(page = 1, itemsPerPage = 10) {
        try {
            const skip = (page - 1) * itemsPerPage;
            const [instructors, total] = await Promise.all([
                this.prisma.instructor.findMany({
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
                            }
                        },
                        department: true,
                        instructorSubjects: {
                            include: {
                                subject: true
                            }
                        }
                    },
                    orderBy: {
                        created_at: 'desc'
                    }
                }),
                this.prisma.instructor.count()
            ]);

            return {
                success: true,
                data: instructors,
                meta: {
                    total,
                    page,
                    itemsPerPage,
                    totalPages: Math.ceil(total / itemsPerPage),
                    hasNextPage: page < Math.ceil(total / itemsPerPage),
                    hasPreviousPage: page > 1
                }
            };
        } catch (error) {
            console.error('Error fetching instructors:', error);
            throw new InternalServerErrorException('Failed to fetch instructors. Please try again later.');
        }
    }

    async getInstructorById(id: string) {
        try {
            const instructor = await this.prisma.instructor.findUnique({
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
                        }
                    },
                    department: true,
                    instructorSubjects: {
                        include: {
                            subject: true
                        }
                    }
                }
            });

            if (!instructor) {
                throw new NotFoundException(`Instructor with ID ${id} not found`);
            }

            return instructor;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Server Error:', error);
            throw new InternalServerErrorException('Error fetching instructor');
        }
    }

    async deleteInstructor(id: string) {
        try {
            const instructor = await this.prisma.instructor.findUnique({
                where: { id },
                include: { user: true }
            });

            if (!instructor) {
                throw new NotFoundException(`Instructor with ID ${id} not found`);
            }

            await this.prisma.$transaction(async (prisma) => {
                // Delete instructor subjects first
                await prisma.instructorSubject.deleteMany({
                    where: { instructorId: id }
                });

                // Delete instructor
                await prisma.instructor.delete({
                    where: { id }
                });

                // Delete user
                await prisma.user.delete({
                    where: { id: instructor.userId }
                });
            });

            return { message: 'Instructor deleted successfully' };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error('Server Error:', error);
            throw new InternalServerErrorException('Error deleting instructor');
        }
    }
}

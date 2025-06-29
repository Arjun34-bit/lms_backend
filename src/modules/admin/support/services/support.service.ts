import { Injectable, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupportDto } from '../dto/create-support.dto';
import { RoleEnum } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Multer } from 'multer';

@Injectable()
export class AdminSupportService {
    constructor(private prisma: PrismaService) { }

    async createSupport(createSupportDto: CreateSupportDto, file?: Multer.File) {
        try {
            const { name, email, password, phoneNumber, address, qualification, experience, imageId } = createSupportDto;

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
                        role: RoleEnum.support,
                        verified: true, // Admin created support staff are automatically verified
                        ...(address ? { address } : {}),
                        ...(imageId ? { imageId } : {})
                    },
                });

                // Create support staff profile
                const support = await prisma.support.create({
                    data: {
                        userId: user.id,
                        ...(qualification ? { qualification } : {}),
                        ...(experience ? { experience } : {})
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
                        }
                    }
                });

                return support;
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            console.error('Server Error:', error);
            throw new InternalServerErrorException('Error creating support staff. Please try again later.');
        }
    }

    async getAllSupport(page = 1, itemsPerPage = 10) {
        try {
            const skip = (page - 1) * itemsPerPage;
            const [supports, total] = await Promise.all([
                this.prisma.support.findMany({
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
                        }
                    }
                }),
                this.prisma.support.count()
            ]);

   

            return {
                data: supports,
                meta: {
                    total,
                    page,
                    itemsPerPage,
                    pageCount: Math.ceil(total / itemsPerPage)
                }
            };
        } catch (error) {
            console.error('Server Error:', error);
            throw new InternalServerErrorException('Error fetching support staff. Please try again later.');
        }
    }
}
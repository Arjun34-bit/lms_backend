import { InstructorJwtDto } from "@modules/common/dtos/instructor-jwt.dto";
import { Injectable } from "@nestjs/common";
import { RoleEnum } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async getProfile(user:InstructorJwtDto) {
        try {
            const userProfile = await this.prisma.user.findUnique({
                where: {
                    id: user.userId,
                    role: RoleEnum.instructor
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phoneNumber: true,
                    firebaseUid: true,
                    role: true,
                    verified: true,
                    instructor: {
                        select: {
                            id: true,
                            department: {
                                select: {
                                    id: true,
                                    name: true,
                                }
                            },
                            instructorSubjects: {
                                select: {
                                    id: true,
                                    subject: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            return userProfile;
        } catch (error) {
            
        }
    }
}
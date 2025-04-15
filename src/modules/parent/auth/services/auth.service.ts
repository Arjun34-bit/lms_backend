import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ParentSignupDto, ParentSigninDto, ConnectChildrenDto } from '../dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentAuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async signup(dto: ParentSignupDto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const parent = await this.prisma.parent.create({
            data: {
                user: {
                    create: {
                        email: dto.email,
                        password: hashedPassword,
                        name: dto.name,
                        role: 'parent',
                    }
                },
                address: dto.address,
            },
            include: {
                user: true,
                students: true,
            }
        });

        return {
            token: this.generateToken(parent),
            parent: this.sanitizeParent(parent)
        };
    }

    async signin(dto: ParentSigninDto) {
        const parent = await this.prisma.parent.findFirst({
            where: {
                user: {
                    email: dto.email
                }
            },
            include: {
                user: true,
                students: true
            }
        });

        if (!parent || !await bcrypt.compare(dto.password, parent.user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return {
            token: this.generateToken(parent),
            parent: this.sanitizeParent(parent)
        };
    }

    async connectChildren(parentId: string, dto: ConnectChildrenDto) {
        const students = await this.prisma.student.updateMany({
            where: {
                id: {
                    in: dto.studentIds
                }
            },
            data: {
                parentId: parentId
            }
        });

        return { message: 'Children connected successfully' };
    }

    async getChildren(parentId: string) {
        const children = await this.prisma.student.findMany({
            where: {
                parentId: parentId
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return { children };
    }

    private generateToken(parent: any) {
        return this.jwtService.sign({
            id: parent.id,
            email: parent.user.email,
            role: 'parent'
        });
    }

    private sanitizeParent(parent: any) {
        const { user, ...parentData } = parent;
        return {
            ...parentData,
            name: user.name,
            email: user.email
        };
    }
}

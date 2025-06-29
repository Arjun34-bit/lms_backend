import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleEnum } from '@prisma/client';

@Injectable()
export class JwtSupportStrategy extends PassportStrategy(Strategy, 'jwt-support') {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { support: true }
        });

        if (!user || user.role !== RoleEnum.support) {
            throw new UnauthorizedException('Invalid support token');
        }

        return user;
    }
}
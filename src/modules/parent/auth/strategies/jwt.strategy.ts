import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtParentStrategy extends PassportStrategy(Strategy, 'parent-jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: any) {
        console.log(payload);
        if (!payload || !payload.id) {
            throw new UnauthorizedException('Invalid token');
        }
        const parent = await this.prisma.parent.findUnique({
            where: { id:  payload.id },
            include: { user: true }
        });
console.log("rehancbhai");
        
        // Check if the user exists and is verified
        if (!parent || !parent.user || !parent.user.verified) {
            throw new UnauthorizedException('Invalid token');
        }

        // Check if the user has the 'parent' role
        if (!parent || parent.user.role !== 'parent') {
            throw new UnauthorizedException('Invalid token');
        }

        return payload;
    }
//     async validate(payload: any) {
//   try {
//     console.log('✅ JWT Payload:', payload);

//     const parent = await this.prisma.parent.findUnique({
//       where: { id: payload.id }, // using parentId from payload
//       include: { user: true }
//     });

//     if (!parent || parent.user.role !== 'parent') {
//       throw new UnauthorizedException('Invalid token');
//     }

//     return {
//       userId: parent.user.id,
//       parentId: parent.id,
//       email: parent.user.email,
//       role: parent.user.role,
//     };

//   } catch (err) {
//     console.error('❌ JWT validation error:', err);
//     throw new UnauthorizedException('Invalid token or internal error');
//   }
// }


}

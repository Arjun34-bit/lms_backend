import { envConstant } from '@constants/index';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { RoleEnum } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-student') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envConstant.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Payload contains the decoded JWT data
    if(payload?.role !== RoleEnum.student) {
      throw new ForbiddenException("You don't have permission to access this resource.")
    }
    return payload;
  }
}

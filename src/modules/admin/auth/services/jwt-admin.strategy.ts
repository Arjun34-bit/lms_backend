import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConstant } from '@constants/index';

// This payload structure should match what's signed in AdminAuthService
type JwtAdminPayload = {
  sub: string; // Typically user ID
  username: string; // Or email
  role: string;
};

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envConstant.JWT_SECRET,
    });
  }

  async validate(payload: JwtAdminPayload): Promise<any> {
    // Basic validation: ensure the token has the admin role
    // More complex validation (e.g., checking if admin user still exists or is active)
    // would typically involve a database lookup, but for static credentials, this might be simpler.
    if (payload.role !== 'admin') {
      throw new UnauthorizedException('Invalid token: User is not an admin.');
    }
    // You can return a user object that will be injected into the request
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
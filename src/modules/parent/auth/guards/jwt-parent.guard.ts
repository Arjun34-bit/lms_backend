import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtParentAuthGuard extends AuthGuard('parent-jwt') { }

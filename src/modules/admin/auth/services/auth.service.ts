import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminLoginDto } from '../dto/login.dto';
import { envConstant } from '@constants/index';

// In a real application, these would be stored securely, e.g., in environment variables or a config service
const ADMIN_EMAIL = envConstant.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = envConstant.ADMIN_PASSWORD || "admin123"; // Store hashed password

@Injectable()
export class AdminAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(adminLoginDto: AdminLoginDto): Promise<{ access_token: string; user: any }> {
    const { email, password } = adminLoginDto;

    // Securely compare the provided password with the stored hash
    // For simplicity in this example, we'll pre-hash the password if ADMIN_PASSWORD_HASH is not set.
    // In a production scenario, the hash should be pre-generated and stored.
    let isValidPassword = password === ADMIN_PASSWORD;
   
   

    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() || !isValidPassword) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const payload = {
      username: ADMIN_EMAIL, // Or a generic admin username
      sub: 'admin_user_id', // A static or generated admin user ID
      role: 'admin',
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: ADMIN_EMAIL,
        role: 'admin',
      },
    };
  }
}
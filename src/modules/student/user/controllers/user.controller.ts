import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { UserService } from '../services/user.service';
import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';

@Controller()
@UseGuards(JwtStudentAuthGuard)
export class UserController {
  constructor(
    private readonly apiUtilsSevice: ApiUtilsService,
    private readonly userService: UserService,
  ) {}

  @Get('profile')
  async getProfile(@GetUser() user: StudentJwtDto) {
    const data = await this.userService.getProfile(user);
    return this.apiUtilsSevice.make_response(data);
  }
}

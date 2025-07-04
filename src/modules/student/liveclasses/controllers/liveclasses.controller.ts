import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { LiveClassesService } from '../services/liveclasses.service';
import { ApiUtilsService } from '@utils/utils.service';
import { GetUser } from 'src/common/decorators/user.decorator';
import { StudentJwtDto } from '@modules/common/dtos/student-jwt.dto';

@Controller()
@UseGuards(JwtStudentAuthGuard)
export class LiveClassesController {
  constructor(
    private readonly liveClassesService: LiveClassesService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Get()
  async getLiveClasses(@GetUser() user: StudentJwtDto) {
    console.log(user);
    const data = await this.liveClassesService.getLiveClasses(user);
    return this.apiUtilsSevice.make_response(data);
  }
}

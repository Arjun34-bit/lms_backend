import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiUtilsService } from "@utils/utils.service";
import { UserService } from "../services/user.service";
import JwtInstructorAuthGuard from "@modules/instructor/auth/guards/jwt-auth.guard";
import { GetUser } from "src/common/decorators/user.decorator";
import { InstructorJwtDto } from "@modules/common/dtos/instructor-jwt.dto";

@Controller()
@UseGuards(JwtInstructorAuthGuard)
export class UserController {
    constructor(
        private readonly apiUtilsSevice: ApiUtilsService,
        private readonly userService: UserService
    ) {}

    @Get('profile')
    async getProfile(@GetUser() user: InstructorJwtDto) {
        const data = await this.userService.getProfile(user);
        return this.apiUtilsSevice.make_response(data);
    }
}
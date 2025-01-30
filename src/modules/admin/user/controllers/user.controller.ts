import { Controller } from "@nestjs/common";
import { ApiUtilsService } from "@utils/utils.service";
import { UserService } from "../services/user.service";


@Controller()
export class UserController {
    constructor(
        private readonly apiUtilsSevice: ApiUtilsService,
        private readonly userService: UserService
    ) {}

}
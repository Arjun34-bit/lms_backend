import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import JwtInstructorAuthGuard from '@modules/instructor/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorator';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { CourseFilterDto } from '@modules/common/dtos/courseFilter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { ReelService } from '../service/reel.service';
import { ReelUploadDto } from '@modules/common/dtos/reeldto';

@Controller()
@UseGuards(JwtInstructorAuthGuard)
export class ReelController {
  constructor(
    private readonly reelservice: ReelService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Post('upload-reel')
  @UseInterceptors(FileInterceptor('video'))
  async createReel(
    @Body() createReelDto: ReelUploadDto,
    @GetUser() user: InstructorJwtDto,
    @UploadedFile() file: Multer.File,
  ) {
    const data = await this.reelservice.uploadReel(createReelDto, user, file);
    return this.apiUtilsSevice.make_response(data);
  }
}

import JwtInstructorAuthGuard from '@modules/instructor/auth/guards/jwt-auth.guard';
import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { LessionService } from '../services/lession.service';
import { CreateLessionDto } from '../dtos/createLession.dto';
import { InstructorJwtDto } from '@modules/common/dtos/instructor-jwt.dto';
import { Multer } from 'multer';
import { GetUser } from 'src/common/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller()
@UseGuards(JwtInstructorAuthGuard)
export class LessionController {
  constructor(
    private readonly lessionService: LessionService,
    private readonly apiUtilsService: ApiUtilsService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('video'))
  async createLession(
    @Body() createLessionDto: CreateLessionDto,
    @GetUser() user: InstructorJwtDto,
    @UploadedFiles() file: Multer.file[],
  ) {
    try {
      const data = await this.lessionService.createLession(
        createLessionDto,
        user,
        file,
      );
      return this.apiUtilsService.make_response(
        data,
        'Lession created successfully',
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

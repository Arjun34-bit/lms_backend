import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiUtilsService } from '@utils/utils.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { MeetingService } from './meeting.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt-admin.guard';

@UseGuards(JwtAdminAuthGuard)
@Controller('admin/meetings')
export class MeetingController {
  constructor(
    private readonly meetingService: MeetingService,
    private readonly apiUtilsService: ApiUtilsService
  ) {}

  @Post()
  async create(@Body() createMeetingDto: CreateMeetingDto) {
    const data = await this.meetingService.create(createMeetingDto);
    return this.apiUtilsService.make_response(data, 'Meeting created successfully');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.meetingService.findOne(id);
    return this.apiUtilsService.make_response(data, 'Meeting retrieved successfully');
  }
}

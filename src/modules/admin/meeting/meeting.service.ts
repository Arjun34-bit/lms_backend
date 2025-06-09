import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';

@Injectable()
export class MeetingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMeetingDto: CreateMeetingDto) {
    return this.prisma.meeting.create({
      data: createMeetingDto,
       
      
    });
  }
}
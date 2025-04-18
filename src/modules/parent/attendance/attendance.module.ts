import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AttendanceController } from './attendance.controller';

@Module({
    imports: [PrismaModule],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule { }

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtParentAuthGuard } from '../auth/guards/jwt-parent.guard';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('parent/attendance')
@UseGuards(JwtParentAuthGuard)
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Get(':studentId')
    getAttendance(
        @GetUser('id') parentId: string,
        @Param('studentId') studentId: string
    ) {
        return this.attendanceService.getAttendance(parentId, studentId);
    }

    @Get(':studentId/participation')
    getParticipation(
        @GetUser('id') parentId: string,
        @Param('studentId') studentId: string
    ) {
        return this.attendanceService.getParticipation(parentId, studentId);
    }
}
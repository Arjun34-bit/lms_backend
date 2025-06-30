import { Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Query('parentId') parentId: string,
    @Query('studentId') studentId: string
  ) {
    return this.notificationsService.getNotifications(parentId, studentId);
  }
}

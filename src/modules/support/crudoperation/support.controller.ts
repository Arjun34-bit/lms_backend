import { Controller, Post, Body, Get, Param, UseGuards, Request, Query, ParseIntPipe } from '@nestjs/common';
import { SupportService } from './support.service';
import JwtStudentAuthGuard from '@modules/student/auth/guards/jwt-auth.guard';
import { JwtParentAuthGuard } from '@modules/parent/auth/guards/jwt-parent.guard';
import JwtInstructorAuthGuard from '@modules/instructor/auth/guards/jwt-auth.guard';
import { JwtAdminAuthGuard } from '@modules/admin/auth/guards/jwt-admin.guard';
import { JwtSupportGuard } from '../auth/guards/jwt-support.guard';
import { AdminReplyDto, CreateSupportMessageDto, ForwardMessageDto, ReplyToMessageDto } from '../dto/support.dto';
import { AnyAuthGuard } from 'src/guards/global.guard';



@Controller('admin/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @UseGuards(AnyAuthGuard(
    JwtParentAuthGuard,
    JwtStudentAuthGuard,
    JwtInstructorAuthGuard
  ))
  @Post('message')
  async createMessage(@Request() req, @Body() dto: CreateSupportMessageDto) {
    console.log('REQ.USER in controller:', req.user);
    return this.supportService.createMessage(req.user.userId||req.user.id, dto);
    
  }
  @UseGuards(JwtSupportGuard)
  @Get('all-user-messages')
  async getAllUserMessages() {
    return this.supportService.getAllUserMessages();
  }
  
  @UseGuards(JwtSupportGuard)
  @Post('reply')
  async replyToMessage(@Request() req, @Body() dto: ReplyToMessageDto) {
    console.log('REPLY REQ.USER:', req.user); // <== log it
    return this.supportService.replyToMessage(req.user.id, dto);
  }

  @UseGuards(JwtSupportGuard)
  @Post('forward/:messageId')
  async forwardToAdmin(
    @Request() req,
    @Param('messageId') messageId: string,
    @Body() dto: ForwardMessageDto
  ) {
    console.log('FORWARD REQ.USER:', req.user); // <== log it
    return this.supportService.forwardToAdmin(req.user.id, {
      ...dto,
      messageId
    });
  }
@UseGuards(JwtAdminAuthGuard)
  @Get('forwarded-messages')
    async getAllForwardedMessages(
        @Query('page', new ParseIntPipe()) page = 1,
        @Query('itemsPerPage', new ParseIntPipe()) itemsPerPage = 10,
    ) { return this.supportService.getAllForwardedMessages(page, itemsPerPage);
    }

  @UseGuards(JwtAdminAuthGuard)
  @Post('admin-reply')
  async adminReply(@Request() req, @Body() dto: AdminReplyDto) {
    console.log('ADMIN REQ.USER:', req.user,dto); // <== log it
    return await this.supportService.adminReply(req.user.userId, dto);
  }

  @UseGuards(AnyAuthGuard(
    JwtParentAuthGuard,
    JwtStudentAuthGuard,
    JwtInstructorAuthGuard
  ))
  @Get('thread/:threadId')
  async getThreadMessages(@Param('threadId') threadId: string) {
    return this.supportService.getThreadMessages(threadId);
  }

  @UseGuards(JwtSupportGuard)
  @Get('reply-admin')
  async getForwardedMessages(@Request() req) {
    return this.supportService.getForwardedMessages(req.user.id);
  }
}
import { Injectable, ForbiddenException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoleEnum } from '@prisma/client';
import { AdminReplyDto, CreateSupportMessageDto, ForwardMessageDto, ReplyToMessageDto } from '../dto/support.dto';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createMessage(userId: string, dto: CreateSupportMessageDto) {

    if (!userId) {
      throw new ForbiddenException('User ID is required');
    }

    console.log(userId)
const user=await this.prisma.user.findUnique({where:{id:userId}})
if (!user) {     
  throw new ForbiddenException('User not found');}
    


    // Create or get thread
    const thread = dto.threadId 
      ? await this.prisma.supportThread.findUnique({ where: { id: dto.threadId } })
      : await this.prisma.supportThread.create({ 
          data: {
            userId: userId
          }
        });
console.log(thread,dto)
    if (dto.threadId && thread.userId !== userId) {
      throw new ForbiddenException('You cannot send messages to this thread');
    }

    // Create message
    return this.prisma.supportMessage.create({
      data: {
        content: dto.content,
        threadId: thread.id,
        senderId: userId,
        role: user.role // or parent/instructor based on user role
      },
      include: {
        sender: true,
        thread: true
      }
    });
  }

  async replyToMessage(supportAgentId: string, dto: ReplyToMessageDto) {
    const thread = await this.prisma.supportThread.findUnique({
      where: { id: dto.threadId }
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return this.prisma.supportMessage.create({
      data: {
        content: dto.content,
        threadId: thread.id,
        senderId: supportAgentId,
        repliedToId: dto.repliedToId,
        role: RoleEnum.support // or support based on agent role
      },
      include: {
        sender: true,
        thread: true,
        repliedTo: true
      }
    });
  }

  async forwardToAdmin(supportAgentId: string, dto: ForwardMessageDto) {
    const message = await this.prisma.supportMessage.findUnique({
      where: { id: dto.messageId },
      include: { thread: true }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Create forwarded message record
    return this.prisma.forwardedMessage.create({
      data: {
        originalMessageId: message.id,
        forwardedById: supportAgentId,
        content: dto.content,
        threadId: message.threadId
      },
      include: {
        originalMessage: true,
        forwardedBy: true,
        thread: true
      }
    });
  }

  async getAllForwardedMessages(page = 1, itemsPerPage = 10) {
    try {
        const skip = (page - 1) * itemsPerPage;
        const [forwardedMessages, total] = await Promise.all([
            this.prisma.forwardedMessage.findMany({
                skip,
                take: itemsPerPage,
                include: {
                    originalMessage: {
                        include: {
                            sender: true
                        }
                    },
                    forwardedBy: {
                        include: {
                            support: true
                        }
                    },
                    thread: true,
                    adminReplies: {
                        include: {
                            admin: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.forwardedMessage.count()
        ]);

        return {
            data: forwardedMessages,
            meta: {
                total,
                page,
                itemsPerPage
            }
        };
    } catch (error) {
        console.error('Error fetching forwarded messages:', error);
        throw new InternalServerErrorException('Error fetching forwarded messages');
    }
}
  async adminReply(adminId: string, dto: AdminReplyDto) {
    const forwardedMessage = await this.prisma.forwardedMessage.findUnique({
      where: { id: dto.forwardedMessageId },
      include: { thread: true, forwardedBy: true }
    });

    if (!forwardedMessage) {
      throw new NotFoundException('Forwarded message not found');
    }

    return this.prisma.adminToSupportReply.create({
      data: {
        content: dto.content,
        adminId: adminId,
        forwardedMessageId: forwardedMessage.id,
        threadId: forwardedMessage.threadId,
        supportAgentId: forwardedMessage.forwardedById
      },
      include: {
        admin: true,
        forwardedMessage: true,
        thread: true,
        supportAgent: true
      }
    });
  }
  

  async getThreadMessages(threadId: string) {
    const thread = await this.prisma.supportThread.findUnique({
      where: { id: threadId },
      include: {
        messages: {
          include: {
            sender: true,
            repliedTo: true
          }
        },
        forwardedMessages: {
          include: {
            originalMessage: true,
            forwardedBy: true
          }
        },
        adminReplies: {
          include: {
            admin: true,
            forwardedMessage: true
          }
        }
      }
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    return thread;
  }

  async getForwardedMessages(supportAgentId: string) {
    return this.prisma.forwardedMessage.findMany({
      where: {
        forwardedById: supportAgentId
      },
      include: {
        originalMessage: true,
        thread: true,
        adminReplies: {
          include: {
            admin: true
          }
        }
      }
    });
  }

async getAllUserMessages() {
  return this.prisma.supportThread.findMany({
    include: {
      user: true,
      messages: {
        include: {
          sender: true,
          repliedTo: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      },
      forwardedMessages: {
        include: {
          originalMessage: true,
          forwardedBy: true
        }
      },
      adminReplies: {
        include: {
          admin: true,
          forwardedMessage: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}


}
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RoleEnum } from '@prisma/client';

export enum SupportRoleType {
  USER = 'user',
  SUPPORT = 'support',
  ADMIN = 'admin'
}

export class CreateSupportMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  threadId?: string; // Optional - if not provided, new thread will be created
}

export class ReplyToMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  threadId: string;

  @IsString()
  @IsOptional()
  repliedToId?: string;
}

export class ForwardMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  content: string; // Additional context from support agent
}

export class AdminReplyDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  forwardedMessageId: string;
}
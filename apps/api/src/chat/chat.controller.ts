import { MessageSend } from '@chat-app/domain';
import { ConversationListElementDto } from '@chat-app/dtos';
import { Body,Controller, Get, Headers, Param, Post } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';

// TODO: implement routes object
@Controller('chat')
export class ChatController {
  constructor(private chatGateway: ChatGateway) {
  }

  // TODO: remove when auth is implemented
  @Get('users')
  async getUsers(): Promise<any> {
    return await this.chatGateway.getAllUsers();
  }

  @Get('conversations')
  async getConversations(@Headers('X-User-Id') userId: string): Promise<ConversationListElementDto[]> {
    return await this.chatGateway.getConversations(userId);
  }

  @Post('conversations')
  async updateMessagesFromQueue(
    @Headers('X-User-Id') userId: string,
    @Body('queue') queue: MessageSend[],
    @Body('conversationId') conversationId: string
    ): Promise<any> {
    return await this.chatGateway.updateMessagesFromQueue(userId, conversationId, queue);
  }

  @Get('conversations/:conversationId')
  async getConversation(
    @Headers('X-User-Id') userId: string,
    @Param('conversationId') conversationId: string): Promise<any> {
    return await this.chatGateway.getConversation(userId, conversationId);
  }
}

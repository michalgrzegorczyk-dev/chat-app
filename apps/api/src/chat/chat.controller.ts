import { ConversationListElementDto, MessageSendDto } from '@chat-app/dtos';
import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';

import { ChatGateway } from './chat.gateway';

const DELAY_MS = 500;

// Helper function to delay promises
const delayResponse = async <T>(promise: Promise<T>): Promise<T> => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  return promise;
};

@Controller('chat')
export class ChatController {
  constructor(private chatGateway: ChatGateway) {}

  @Get('users')
  async getUsers(): Promise<any> {
    return await delayResponse(this.chatGateway.getAllUsers());
  }

  @Get('conversations')
  async getConversations(
    @Headers('X-User-Id') userId: string
  ): Promise<ConversationListElementDto[]> {
    return await delayResponse(this.chatGateway.getConversations(userId));
  }

  @Post('conversations')
  async updateMessagesFromQueue(
    @Headers('X-User-Id') userId: string,
    @Body('queue') queue: MessageSendDto[],
    @Body('conversationId') conversationId: string
  ): Promise<any> {
    return await delayResponse(
      this.chatGateway.updateMessagesFromQueue(userId, conversationId, queue)
    );
  }

  @Get('conversations/:conversationId')
  async getConversation(
    @Headers('X-User-Id') userId: string,
    @Param('conversationId') conversationId: string
  ): Promise<any> {
    return await delayResponse(
      this.chatGateway.getConversation(userId, conversationId)
    );
  }
}

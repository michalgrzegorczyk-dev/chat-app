import { ConversationListElementDto, MessageSendDto } from "@chat-app/dtos";
import { Body, Controller, Get, Logger, Param, Post, Request, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../auth/jwt-auth.guard";

import { ChatGateway } from "./chat.gateway";

const DELAY_MS = 500;

const delayResponse = async <T>(promise: Promise<T>): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
  return promise;
};

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private chatGateway: ChatGateway) {
    this.logger.log("ChatController initialized");
  }

  @Get("conversations")
  @UseGuards(JwtAuthGuard)
  async getConversations(@Request() req): Promise<ConversationListElementDto[]> {
    const userId = req.user.id;
    return await delayResponse(this.chatGateway.getConversations(String(userId)));
  }

  @Post("conversations")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateMessagesFromQueue(@Request() req, @Body("queue") queue: MessageSendDto[], @Body("conversationId") conversationId: string): Promise<any> {
    const userId = req.user.id;
    return await delayResponse(this.chatGateway.updateMessagesFromQueue(userId, conversationId, queue));
  }

  @Get("conversations/:conversationId")
  @UseGuards(JwtAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getConversation(@Request() req, @Param("conversationId") conversationId: string): Promise<any> {
    const userId = req.user.id;
    return await delayResponse(this.chatGateway.getConversation(userId, conversationId));
  }
}

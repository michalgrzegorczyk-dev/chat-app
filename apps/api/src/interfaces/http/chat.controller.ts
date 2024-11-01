import { ConversationListElementDto, ConversationDetailsDto, MessageSendDto } from "@chat-app/dtos";
import { Controller, Get, Param, Request, UseGuards, Post, Body } from "@nestjs/common";

import { ConversationService } from "../../application/services/conversation.service";
import { JwtAuthGuard } from "../../infrastructure/auth/jwt-auth.guard";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private conversationService: ConversationService) {}

  @Get("conversations")
  @UseGuards(JwtAuthGuard)
  async getConversations(@Request() req): Promise<ConversationListElementDto[]> {
    const userId = req.user.id;
    console.log("XXX");
    return await this.conversationService.getUserConversations(userId);
  }

  @Get("conversations/:conversationId")
  @UseGuards(JwtAuthGuard)
  async getConversation(@Request() req, @Param("conversationId") conversationId: string): Promise<ConversationDetailsDto> {
    const userId = req.user.id;
    return await this.conversationService.getConversationDetails(userId, conversationId);
  }

  // @Post("conversations")
  // async updateMessagesFromQueue(@Request() req, @Body("queue") queue: MessageSendDto[], @Body("conversationId") conversationId: string): Promise<any> {
  //   const userId = req.user.id;
  //   return await delayResponse(this.chatGateway.updateMessagesFromQueue(userId, conversationId, queue));
  // }
}

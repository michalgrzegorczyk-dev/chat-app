import { Controller, Get, Param, Request, UseGuards } from "@nestjs/common";

import { ConversationApplicationService } from "../../application/conversation/services/conversation-application.service";
import { JwtAuthGuard } from "../../infrastructure/security/guards/jwt-auth.guard";
import { ConversationListElementDto } from "../../shared/dto/conversation/conversation-list.dto";
import { ConversationDetailsDto } from "../../shared/dto/conversation/conversation-details.dto";

function delayResponse<T>(response: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, 0);
  });
}

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private conversationService: ConversationApplicationService) {}

  @Get("conversations")
  @UseGuards(JwtAuthGuard)
  async getConversations(@Request() req): Promise<ConversationListElementDto[]> {
    const userId = req.user.id;
    return await delayResponse(this.conversationService.getUserConversations(userId));
  }

  @Get("conversations/:conversationId")
  @UseGuards(JwtAuthGuard)
  async getConversation(@Request() req, @Param("conversationId") conversationId: string): Promise<ConversationDetailsDto> {
    const userId = req.user.id;
    return await delayResponse(this.conversationService.getConversationDetails(userId, conversationId));
  }

  // @Post("conversations")
  // async updateMessagesFromQueue(@Request() req, @Body("queue") queue: MessageSendDto[], @Body("conversationId") conversationId: string): Promise<any> {
  //   const userId = req.user.id;
  //   return await delayResponse(this.chatGateway.updateMessagesFromQueue(userId, conversationId, queue));
  // }
}

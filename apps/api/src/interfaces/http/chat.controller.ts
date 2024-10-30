import { Controller, Get, Param, UseGuards, Request } from "@nestjs/common";
import { JwtAuthGuard } from "../../infrastructure/auth/jwt-auth.guard";
import { ConversationService } from "../../application/services/conversation.service";
import { ConversationListElementDto } from "@chat-app/dtos";

@Controller("chat")
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private conversationService: ConversationService) {}

  // @Get("conversations")
  // async getConversations(@Request() req) {
  //   return this.conversationService.getUserConversations(req.user.id);
  // }

  @Get("conversations")
  @UseGuards(JwtAuthGuard)
  async getConversations(@Request() req) {
    //todo user?
    const userId = req.user.id;
    return await this.conversationService.getUserConversations(userId);
  }

  // @Get("conversations/:id")
  // async getConversation(@Param("id") id: string, @Request() req) {
  //   return this.conversationService.getConversationDetails(id);
  // }

  // @Get("conversations/:conversationId")
  // @Get("conversations/:id")
  // @UseGuards(JwtAuthGuard)
  // async getConversation(@Request() req, @Param("id") id: string) {
  //   const userId = req.user.id;
  //   return await this.conversationService.getConversationDetails(userId, id);
  // }
}

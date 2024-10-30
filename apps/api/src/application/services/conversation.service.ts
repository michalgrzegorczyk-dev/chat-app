import { Injectable } from "@nestjs/common";

import { ConversationRepository } from "../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../domain/conversation/value-objects/conversation-id";

@Injectable()
export class ConversationService {
  constructor(private conversationRepository: ConversationRepository) {}

  async getUserConversations(userId: string) {
    const conversations = await this.conversationRepository.findByUserId(userId);

    return conversations.map((conv) => ({
      id: conv.getId().getValue(),
      name: conv.getName(),
      lastMessage: conv.getLastMessage()?.getContent(),
      members: conv.getMembers().map((m) => ({
        id: m.getId(),
        name: m.getName(),
        avatarUrl: m.getAvatarUrl(),
      })),
    }));
  }

  async getConversationDetails(conversationId: string) {
    const conversation = await this.conversationRepository.findById(new ConversationId(conversationId));

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    return {
      id: conversation.getId().getValue(),
      name: conversation.getName(),
      members: conversation.getMembers().map((m) => ({
        id: m.getId(),
        name: m.getName(),
        avatarUrl: m.getAvatarUrl(),
      })),
    };
  }
}

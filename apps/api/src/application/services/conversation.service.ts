import { ConversationDetailsDto, ConversationListElementDto } from "@chat-app/dtos";
import { Inject, Injectable } from "@nestjs/common";

import { CONVERSATION_REPOSITORY, ConversationRepository } from "../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../domain/conversation/value-objects/conversation-id";
import { MESSAGE_REPOSITORY, MessageRepository } from "../../domain/messages/repositories/message.repository";

@Injectable()
export class ConversationService {
  constructor(
    @Inject(CONVERSATION_REPOSITORY) private conversationRepository: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY) private messageRepository: MessageRepository,
  ) {}

  async getUserConversations(userId: string): Promise<ConversationListElementDto[]> {
    console.log("YYYYYYY");
    return await this.conversationRepository.getUserConversations(userId);
  }

  async getConversationDetails(userId: string, conversationId: string): Promise<ConversationDetailsDto> {
    const conversationIdVO = new ConversationId(conversationId);
    // todo it should be more clear like return conversation then get messages etc now it is dirty
    const conversationDetails = await this.conversationRepository.findById(conversationIdVO);

    return {
      conversationId: conversationDetails.conversationId,
      messageList: conversationDetails.messageList,
      memberList: conversationDetails.memberList,
    };
  }
}

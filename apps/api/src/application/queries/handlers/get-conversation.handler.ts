import { ConversationDetailsDto } from "@chat-app/dtos";
import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { CONVERSATION_REPOSITORY, ConversationRepository } from "../../../domain/conversation/repositories/conversation.repository";
import { GetConversationQuery } from "../get-conversation.query";
import { ConversationId } from "../../../domain/conversation/value-objects/conversation-id";

@QueryHandler(GetConversationQuery)
export class GetConversationHandler implements IQueryHandler<GetConversationQuery> {
  constructor(
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
  ) {}

  async execute(query: GetConversationQuery): Promise<ConversationDetailsDto> {
    return await this.conversationRepository.findById(new ConversationId(query.conversationId));
  }
}

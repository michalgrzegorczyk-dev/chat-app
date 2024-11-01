export class GetConversationQuery {
  constructor(
    public readonly userId: string,
    public readonly conversationId: string,
  ) {}
}

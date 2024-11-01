export class SendMessageCommand {
  constructor(
    public readonly content: string,
    public readonly senderId: string,
    public readonly conversationId: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}

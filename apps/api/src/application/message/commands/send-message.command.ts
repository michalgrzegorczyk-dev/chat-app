// src/application/commands/send-message.command.ts
export class SendMessageCommand {
  constructor(
    public readonly content: string,
    public readonly senderId: string,
    public readonly conversationId: string,
    public readonly timestamp: Date = new Date(),
    public readonly localMessageId: string,
  ) {
    if (!localMessageId) {
      throw new Error("localMessageId is required");
    }
  }
}

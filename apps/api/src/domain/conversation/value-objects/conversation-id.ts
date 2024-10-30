export class ConversationId {
  constructor(private readonly value: string) {
    if (!value) {
      throw new Error("Conversation ID cannot be empty");
    }
  }

  public getValue(): string {
    return this.value;
  }
}

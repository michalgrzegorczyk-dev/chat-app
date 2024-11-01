// src/application/events/message-sent.event.ts
export class MessageSentEvent {
  constructor(
    public readonly message: {
      id: string;
      content: string;
      senderId: string;
      conversationId: string;
      createdAt: Date;
      status: string;
      localMessageId?: string;
    },
    public readonly sender: {
      id: string;
      name: string;
      profilePhotoUrl?: string;
    },
  ) {}
}

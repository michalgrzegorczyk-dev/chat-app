import { inject, Injectable } from "@angular/core";
import { ENVIRONMENT } from "@chat-app/environment";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { Subject } from "rxjs";
import { io } from "socket.io-client";

import { Conversation, ReceivedMessage } from "../models";
import { MessageSendDto } from "@chat-app/dtos";

@Injectable()
export class ChatInfrastructureWebSockets {
  readonly messageReceived$ = new Subject<ReceivedMessage>();
  readonly loadConversationListSuccess$ = new Subject<Conversation[]>();
  readonly #environment = inject(ENVIRONMENT);
  readonly #socket = io(this.#environment.apiUrl, {
    query: { userId: inject(AuthService).user().id },
    transports: ["websocket"],
    withCredentials: true,
  });

  constructor() {
    this.setupSocketListeners();
  }

  sendMessageWebSocket(messageSend: MessageSendDto): void {
    this.#socket.emit("sendMessage", messageSend, (error: any) => {
      if (error) {
        console.error("Error sending message:", error);
      }
    });
  }

  private setupSocketListeners(): void {
    this.#socket.on("sendMessageSuccess", (message: any) => {
      this.messageReceived$.next({
        conversationId: message.conversation_id,
        localMessageId: message.local_message_id,
        content: message.content,
        createdAt: message.created_at,
        messageId: message.id,
        senderId: message.sender_id,
        status: "sent",
      });
    });

    this.#socket.on(
      "loadConversationListSuccess",
      (conversationList: Conversation[]) => {
        this.loadConversationListSuccess$.next(conversationList);
      },
    );
  }
}

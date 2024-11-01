import { inject, Injectable } from "@angular/core";
import { MessageSendDto } from "@chat-app/dtos";
import { ENVIRONMENT } from "@chat-app/environment";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { Subject } from "rxjs";
import { io } from "socket.io-client";

import { Conversation, ReceivedMessage } from "../models";

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
    console.log("sending 'sendMessage'");
    this.#socket.emit("sendMessage", messageSend, (error: any) => {
      if (error) {
        console.error("Error sending message:", error);
      }
    });
  }

  private setupSocketListeners(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.#socket.on("sendMessageSuccess", (dto: any) => {
      console.log("Received 'sendMessageSuccess'", dto);
      this.messageReceived$.next({
        conversationId: dto.conversationId,
        localMessageId: dto.message.local_message_id,
        content: dto.message.content,
        createdAt: dto.message.created_at,
        messageId: dto.message.message_id,
        senderId: dto.sender.id,
        status: dto.message.status,
      });
    });

    this.#socket.on("loadConversationListSuccess", (conversationList: Conversation[]) => {
      this.loadConversationListSuccess$.next(conversationList);
    });
  }
}

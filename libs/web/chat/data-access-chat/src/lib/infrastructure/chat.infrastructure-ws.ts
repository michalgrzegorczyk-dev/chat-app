import { inject, Injectable, DestroyRef } from "@angular/core";
import { MessageSendDto } from "@chat-app/dtos";
import { ENVIRONMENT } from "@chat-app/environment";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { Subject, BehaviorSubject } from "rxjs";
import { io } from "socket.io-client";

import { Conversation, ReceivedMessage } from "../models";
import { Socket } from "socket.io";

// WebSocket Events interface
interface WebSocketEvents {
  sendMessage: (message: MessageSendDto) => void;
  joinConversation: (data: { conversationId: string }) => void;
  leaveConversation: (data: { conversationId: string }) => void;
  typing: (data: { conversationId: string; isTyping: boolean }) => void;
}

// WebSocket Response Events interface
interface WebSocketResponseEvents {
  sendMessageSuccess: (data: {
    conversationId: string;
    message: {
      local_message_id: string;
      content: string;
      created_at: string;
      message_id: string;
      sender_id: string;
      status: string;
    };
    messageList: any[];
  }) => void;
  sendMessageError: (data: { error: string; originalMessage: MessageSendDto }) => void;
  loadConversationListSuccess: (conversations: Conversation[]) => void;
  userTyping: (data: { userId: string; conversationId: string; isTyping: boolean }) => void;
  error: (error: { message: string; type: string }) => void;
}

@Injectable()
export class ChatInfrastructureWebSockets {
  // readonly messageReceived$ = new Subject<ReceivedMessage>();
  readonly loadConversationListSuccess$ = new Subject<Conversation[]>();
  readonly #environment = inject(ENVIRONMENT);
  // readonly #socket = io(this.#environment.apiUrl, {
  //   query: { userId: inject(AuthService).user().id },
  //   transports: ["websocket"],
  //   withCredentials: true,
  // });

  #socket: any;
  private connectionStatus$ = new BehaviorSubject<boolean>(false);

  // Event streams
  readonly messageReceived$ = new Subject<ReceivedMessage>();
  readonly conversationList$ = new Subject<Conversation[]>();
  readonly typingStatus$ = new Subject<{ userId: string; conversationId: string; isTyping: boolean }>();
  readonly error$ = new Subject<{ type: string; message: string }>();

  constructor() {
    const environment = inject(ENVIRONMENT);
    const authService = inject(AuthService);
    const destroyRef = inject(DestroyRef);

    this.#socket = io(this.#environment.apiUrl, {
      query: { userId: inject(AuthService).user().id },
      transports: ["websocket"],
      withCredentials: true,
    });
    // this.setupSocketListeners();
    this.setupSocketListeners();
    this.setupConnectionHandling();

    // Cleanup on destroy
    // destroyRef.onDestroy(() => {
    //   this.disconnect();
    // });
  }

  private setupConnectionHandling(): void {
    this.#socket.on("connect", () => {
      this.connectionStatus$.next(true);
      // this.handleReconnection();
    });

    this.#socket.on("disconnect", () => {
      this.connectionStatus$.next(false);
    });

    this.#socket.on("connect_error", (error: any) => {
      this.error$.next({
        type: "CONNECTION_ERROR",
        message: error.message,
      });
    });
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

import { inject, Injectable, OnDestroy } from "@angular/core";
import { MessageSendDto } from "@chat-app/dtos";
import { ENVIRONMENT } from "@chat-app/environment";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { BehaviorSubject, Subject } from "rxjs";
import { io } from "socket.io-client";

import { ReceivedMessage } from "../models";
import { SocketError, SocketEvent } from "../models/socket.types";

@Injectable()
export class ChatInfrastructureWebSockets implements OnDestroy {
  readonly #environment = inject(ENVIRONMENT);
  readonly #authService = inject(AuthService);
  readonly socket = io(this.#environment.apiUrl, {
    query: { userId: this.#authService.user().id },
    transports: ["websocket"],
    withCredentials: true,
  });

  readonly #connectionStatus = new BehaviorSubject<boolean>(false);
  readonly #messageReceived = new Subject<ReceivedMessage>();
  readonly messageReceived$ = this.#messageReceived.asObservable();
  readonly #error = new Subject<SocketError>();

  constructor() {
    this.setupEventListeners();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }

  sendMessage(message: MessageSendDto) {
    if (!this.socket.connected) {
      return;
    }

    this.socket.emit(SocketEvent.SEND_MESSAGE, message);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
    }
  }

  private setupEventListeners(): void {
    this.socket.on("connect", () => this.#connectionStatus.next(true));
    this.socket.on("disconnect", () => this.#connectionStatus.next(false));
    this.socket.on("connect_error", this.handleConnectionError.bind(this));

    this.socket.on(SocketEvent.SEND_MESSAGE_SUCCESS, this.handleMessageSuccess.bind(this));
  }

  private handleMessageSuccess(dto: any): void {
    const message: ReceivedMessage = {
      conversationId: dto.conversationId,
      localMessageId: dto.message.local_message_id,
      content: dto.message.content,
      createdAt: dto.message.created_at,
      messageId: dto.message.message_id,
      senderId: dto.sender.id,
      status: dto.message.status,
    };
    this.#messageReceived.next(message);
  }

  private handleConnectionError(error: any): void {
    this.#error.next({
      type: "CONNECTION_ERROR",
      message: error.message,
    });
  }
}

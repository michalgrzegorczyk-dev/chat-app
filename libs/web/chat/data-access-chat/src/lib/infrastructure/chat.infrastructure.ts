import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConversationDetailsDto, ConversationListElementDto } from '@chat-app/dtos';
import { ENVIRONMENT } from '@chat-app/environment';
import { routes, ROUTE_PARAMS } from '@chat-app/util-routing';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { map, Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';

import { Conversation, MessageSend, ReceivedMessage } from '../models';

@Injectable()
export class ChatInfrastructure {
  readonly messageReceived$ = new Subject<ReceivedMessage>();
  readonly loadConversationListSuccess$ = new Subject<Conversation[]>();
  readonly loadConversationListPing$ = new Subject<boolean>();

  readonly #environment = inject(ENVIRONMENT);
  readonly #socket = io(this.#environment.apiUrl, {
    query: { userId: inject(AuthService).user().id },
    transports: ['websocket'],
    withCredentials: true
  });
  readonly #http = inject(HttpClient);
  readonly #authService = inject(AuthService);

  constructor() {
    this.setupSocketListeners();
  }

  getConversationContent(conversation: Conversation) {
    const headers = new HttpHeaders().set(
      'X-User-Id',
      this.#authService.user().id
    );
    const params = new HttpParams()
      .set(ROUTE_PARAMS.USER_ID, this.#authService.user().id)
      .set(ROUTE_PARAMS.CONVERSATION_ID, conversation.conversationId);

    return this.#http
      .get<ConversationDetailsDto>(
        `${this.#environment.apiUrl}${routes.chat.conversation.content.url(conversation.conversationId)}`,
        { params, headers }
      )
      .pipe(
        map((convDetailsDto) => {
          return {
            conversationId: convDetailsDto.conversationId,
            messageList: convDetailsDto?.messageList.map((message) => {
              return {
                messageId: message.message_id,
                senderId: message.sender_id,
                content: message.content,
                createdAt: message.created_at
              };
            }),
            memberList: convDetailsDto.memberList.map((member: any) => {
              return {
                id: member.id,
                name: member.name,
                avatarUrl: member.profile_photo_url
              };
            })
          };
        })
      );
  }

  fetchConversations(): Observable<Conversation[]> {
    const headers = new HttpHeaders().set('X-User-Id', this.#authService.user().id);

    return this.#http
      .get<ConversationListElementDto[]>(`${this.#environment.apiUrl}${routes.chat.conversations.url()}`, {
        headers
      })
      .pipe(
        map((conversationDtoList: ConversationListElementDto[]) => {
          return conversationDtoList.map((conversationDto: ConversationListElementDto) => {
            return {
              ...conversationDto
            };
          });
        })
      );
  }

  sendMessageWebSocket(messageSend: MessageSend): void {
    this.#socket.emit('sendMessage', messageSend, ((error: any) => {
      if (error) {
        console.error('Error sending message:', error);
      }
    }));
  }

  private setupSocketListeners(): void {
    this.#socket.on('sendMessageSuccess', (message: any) => {
      this.messageReceived$.next({
        conversationId: message.conversation_id,
        localMessageId: message.local_message_id,
        content: message.content,
        createdAt: message.created_at,
        messageId: message.id,
        senderId: message.sender_id,
        status: 'sent'
      });
    });

    this.#socket.on('loadConversationListSuccess', (conversationList: Conversation[]) => {
      this.loadConversationListSuccess$.next(conversationList);
    });
  }
}

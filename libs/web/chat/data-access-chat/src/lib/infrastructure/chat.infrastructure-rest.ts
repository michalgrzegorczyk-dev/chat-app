import { Injectable, inject } from "@angular/core";
import { Conversation } from "@chat-app/domain";
import { HttpHeaders, HttpParams, HttpClient } from "@angular/common/http";
import { ROUTE_PARAMS, routes } from "@chat-app/util-routing";
import {
  ConversationDetailsDto,
  ConversationListElementDto,
} from "@chat-app/dtos";
import { map, Observable } from "rxjs";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { ENVIRONMENT } from "@chat-app/environment";

@Injectable()
export class ChatInfrastructureRest {
  readonly #http = inject(HttpClient);
  readonly #authService = inject(AuthService);
  readonly #environment = inject(ENVIRONMENT);

  getConversationContent(conversation: Conversation) {
    const headers = new HttpHeaders().set(
      "X-User-Id",
      this.#authService.user().id,
    );
    const params = new HttpParams()
      .set(ROUTE_PARAMS.USER_ID, this.#authService.user().id)
      .set(ROUTE_PARAMS.CONVERSATION_ID, conversation.conversationId);

    return this.#http
      .get<ConversationDetailsDto>(
        `${this.#environment.apiUrl}${routes.chat.conversation.content.url(
          conversation.conversationId,
        )}`,
        { params, headers },
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
                createdAt: message.created_at,
              };
            }),
            memberList: convDetailsDto.memberList.map((member: any) => {
              return {
                id: member.id,
                name: member.name,
                avatarUrl: member.profile_photo_url,
              };
            }),
          };
        }),
      );
  }

  fetchConversations(): Observable<Conversation[]> {
    const headers = new HttpHeaders().set(
      "X-User-Id",
      this.#authService.user().id,
    );

    return this.#http
      .get<ConversationListElementDto[]>(
        `${this.#environment.apiUrl}${routes.chat.conversations.url()}`,
        {
          headers,
        },
      )
      .pipe(
        map((conversationDtoList: ConversationListElementDto[]) => {
          return conversationDtoList.map(
            (conversationDto: ConversationListElementDto) => {
              return {
                ...conversationDto,
              };
            },
          );
        }),
      );
  }
}

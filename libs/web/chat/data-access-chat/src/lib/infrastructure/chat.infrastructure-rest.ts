import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {
  ConversationDetailsDto,
  ConversationListElementDto,
} from "@chat-app/dtos";
import { ENVIRONMENT } from "@chat-app/environment";
import { ROUTE_PARAMS, routes } from "@chat-app/util-routing";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { firstValueFrom, map } from "rxjs";

import { Conversation } from "../models/conversation.type";

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

  fetchConversations() {
    const headers = new HttpHeaders().set(
      "X-User-Id",
      this.#authService.user().id,
    );

    return firstValueFrom(
      this.#http.get<ConversationListElementDto[]>(
        `${this.#environment.apiUrl}${routes.chat.conversations.url()}`,
        {
          headers,
        },
      ),
    );
  }
}

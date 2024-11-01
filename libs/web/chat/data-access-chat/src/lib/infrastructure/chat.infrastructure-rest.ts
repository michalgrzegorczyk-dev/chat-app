import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
// eslint-disable-next-line
import { Conversation } from "@chat-app/domain";
import { ConversationDetailsDto, ConversationListElementDto } from "@chat-app/dtos";
import { ENVIRONMENT } from "@chat-app/environment";
import { ROUTE_PARAMS, routes } from "@chat-app/util-routing";
import { firstValueFrom, map, of, tap } from "rxjs";

@Injectable()
export class ChatInfrastructureRest {
  readonly #http = inject(HttpClient);
  readonly #environment = inject(ENVIRONMENT);

  getConversationContent(conversation: Conversation) {
    const params = new HttpParams().set(ROUTE_PARAMS.CONVERSATION_ID, conversation.conversationId);

    return this.#http
      .get<ConversationDetailsDto>(`${this.#environment.apiUrl}${routes.chat.conversation.content.url(conversation.conversationId)}`, { params })
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
    return firstValueFrom(this.#http.get<ConversationListElementDto[]>(`${this.#environment.apiUrl}${routes.chat.conversations.url()}`).pipe(tap(console.log)));
  }

  updateConversationName(conversationId: any, name: string) {
    return of(true);
  }
}

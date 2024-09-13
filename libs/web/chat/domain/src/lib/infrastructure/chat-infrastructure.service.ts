import {Injectable, inject} from "@angular/core";
import {
  ConversationDetailsDto,
  MessageDto,
  ReceiveMessageDto
} from "../../../../../../shared/dto/converstaion-details.dto";
import {environment} from "../../../../environments/environment";
import {CHAT_ROUTES, ROUTES_PARAMS} from "../../../app.routes";
import {map, Subject} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AuthService} from "../../../shared/auth/utils-auth/auth.service";
import {ConversationDto} from "../../../../../../shared/dto/conversation.dto";
import {SOCKET_COMMANDS} from "../../../../../../shared/websocket/websocket.commands";
import {io} from "socket.io-client";
import {Conversation} from "../entities/conversation.type";
import {MessageSend} from "../entities/message-send.type";
import {Message, ReceivedMessage} from "../entities/message.type";

// component store, nie powinien wyjsc poza libke, lub mocno przemyles

@Injectable({
  providedIn: 'root'
})
export class ChatInfrastructureService {
  readonly receiveMessage$ = new Subject<ReceivedMessage>();
  private readonly socket = io(environment.apiUrl, {
    transports: ['websocket'],
    withCredentials: true
  });
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  constructor() {
    this.setupSocketListeners();
  }

  getConversationDetails(sc: Conversation) {

    const headers = new HttpHeaders().set('X-User-Id', this.authService.user().id);
    const params = new HttpParams().set(ROUTES_PARAMS.USER_ID, this.authService.user().id).set(ROUTES_PARAMS.CONVERSATION_ID, sc.conversationId);

    return this.http.get<ConversationDetailsDto>(`${environment.apiUrl}${CHAT_ROUTES.CONVERSATION_DETAILS.GET}/${sc.conversationId}`,
      {params, headers}).pipe(map((convDetailsDto) => {
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
        memberList: convDetailsDto.memberList.map((member) => {
          return {
            id: member.id,
            name: member.name,
            avatarUrl: member.profile_photo_url
          }
        }),
      }
    }))
  }

  fetchConversations() {
    const headers = new HttpHeaders().set('X-User-Id', this.authService.user().id);
    return this.http.get<ConversationDto[]>(`${environment.apiUrl}/chat/conversations`, {headers}).pipe(
      map((conversations: ConversationDto[]) => {
        return conversations.map((conversation: ConversationDto) => {
          return {
            ...conversation,
            active: false,
          };
        });
      })
    )
  }

  sendMessage(messageSend: MessageSend) {
    this.socket.emit(SOCKET_COMMANDS.SEND_MESSAGE, messageSend);
  }

  private setupSocketListeners() {
    this.socket.on(SOCKET_COMMANDS.RECEIVE_MESSAGE, (message: ReceiveMessageDto) => {
      this.receiveMessage$.next({
        conversationId: message.conversation_id,
        content: message.content,
        createdAt: message.created_at,
        messageId: message.message_id,
        senderId: message.sender_id,
      });
    });
  }
}

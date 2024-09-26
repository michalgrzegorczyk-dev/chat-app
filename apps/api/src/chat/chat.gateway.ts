import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupabaseService } from './supabase.service';
import { Logger } from '@nestjs/common';
import { SendMessageRequestDto, ConversationDetailsDto, ConversationListElementDto } from '@chat-app/dtos';

// TODO: implement disconnect
// TODO: implement error handling
@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private globalUsersSocketMap = new Map<string, string>();
  private logger = new Logger('ChatGateway');

  constructor(private supabaseService: SupabaseService) {
  }

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;
      if (!userId) {
        this.logger.error('User ID not provided in connection');
        client.disconnect();
        return;
      }
      //check if user exist in globaluserssocketmap
      // if (this.globalUsersSocketMap.has(userId)) {
      //   console.log('User already connected');
      //   console.log(this.globalUsersSocketMap.get(userId));
      // } else {
      //   this.globalUsersSocketMap.set(userId, client.id);
      // }
        this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
      this.globalUsersSocketMap.set(userId, client.id);
    } catch (error) {
      this.logger.error(`Error in handleConnection: ${error.message}`);
    }
  }

  // TODO: client never used but can be used to notify the sender that the message was sent
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() requestDto: SendMessageRequestDto, @ConnectedSocket() client: Socket): Promise<void> {
    console.log('handleSendMessage');

    await this.supabaseService.updateConversationList(requestDto);
    const savedMessage = await this.supabaseService.saveMessage(requestDto);
    const conversationUsers = await this.supabaseService.getUserIdListFromConversation(requestDto.conversationId);

    for (const userId of conversationUsers) {
      console.log('for',this.globalUsersSocketMap );
      const userSocketId = this.globalUsersSocketMap.get(userId);
      if (userSocketId) {
        const conversations = await this.supabaseService.getConversationsByUserId(userId);
        const userSocketId = this.globalUsersSocketMap.get(userId);

        if (userSocketId) {
          console.log('wchodze tu?')
          this.server.to(userSocketId).emit('loadConversationListSuccess', conversations);
          this.server.to(userSocketId).emit('sendMessageSuccess', savedMessage);
        }
      }
    }
  }

  async getConversation(userId: string, conversationId: string): Promise<ConversationDetailsDto> {
    return await this.supabaseService.getConversation(userId, conversationId);
  }

  async getConversations(userId: string): Promise<ConversationListElementDto[]> {
    return await this.supabaseService.getConversationsByUserId(userId);
  }

  // TODO: remove after auth is implemented
  async getAllUsers(): Promise<any> {
    return await this.supabaseService.getAllUsers();
  }
}

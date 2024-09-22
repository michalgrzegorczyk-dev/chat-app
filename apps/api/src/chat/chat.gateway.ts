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
import { SendMessageDto, ConversationDetailsDto, ConversationListElementDto } from '@chat-app/dtos';

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
      this.globalUsersSocketMap.set(userId, client.id);
      this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
    } catch (error) {
      this.logger.error(`Error in handleConnection: ${error.message}`);
    }
  }

  // TODO: client never used but can be used to notify the sender that the message was sent
  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() sendMessageDto: SendMessageDto, @ConnectedSocket() client: Socket): Promise<void> {
    await this.supabaseService.updateConversationList(sendMessageDto);
    const savedMessage = await this.supabaseService.saveMessage(sendMessageDto);
    const conversationUsers = await this.supabaseService.getUserIdListFromConversation(sendMessageDto.conversationId);

    for (const userId of conversationUsers) {
      const userSocketId = this.globalUsersSocketMap.get(userId);
      if (userSocketId) {
        const conversations = await this.supabaseService.getConversationsByUserId(userId);
        const userSocketId = this.globalUsersSocketMap.get(userId);

        if (userSocketId) {
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

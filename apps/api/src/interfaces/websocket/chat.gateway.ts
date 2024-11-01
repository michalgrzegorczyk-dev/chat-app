import { SendMessageRequestDto } from "@chat-app/dtos";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

import { SendMessageCommand } from "../../application/commands/send-message.command";
import { CONVERSATION_REPOSITORY, ConversationRepository } from "../../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../../domain/conversation/value-objects/conversation-id";
import { MESSAGE_REPOSITORY, MessageRepository } from "../../domain/messages/repositories/message.repository";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);
  private readonly connectedUsers: Map<string, Socket> = new Map();

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  @SubscribeMessage("sendMessage")
  async handleSendMessage(@MessageBody() dto: SendMessageRequestDto, @ConnectedSocket() client: Socket): Promise<void> {
    this.logger.log(`Handling sendMessage: ${JSON.stringify(dto)}`);

    const command = new SendMessageCommand(dto.content, dto.userId, dto.conversationId, dto.timestamp || new Date(), dto.localMessageId);
    // This will trigger the MessageSentEvent through the command handler
    await this.commandBus.execute(command);

    this.logger.log("Message command executed successfully");
  }

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;
      if (!userId) {
        this.logger.error("User ID not provided in connection");
        client.disconnect();
        return;
      }
      client.join(`user:${userId}`);
      this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
    } catch (error) {
      this.logger.error(`Error in handleConnection: ${error.message}`);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;
      if (userId) {
        this.handleUserDisconnection(client, userId);
      }
    } catch (error) {
      this.logger.error(`Error in handleDisconnect: ${error.message}`);
    }
  }

  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  private handleUserDisconnection(client: Socket, userId: string): void {
    client.leave(`user:${userId}`);
    this.connectedUsers.delete(userId);
    this.logger.log(`Client disconnected: ${client.id} for user: ${userId}`);
  }
}

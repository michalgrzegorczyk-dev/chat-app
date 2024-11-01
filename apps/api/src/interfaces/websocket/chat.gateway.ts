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
  ) {}

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;
      if (!userId) {
        this.logger.error("User ID not provided in connection");
        client.disconnect();
        return;
      }

      await this.handleUserConnection(client, userId);
    } catch (error) {
      this.logger.error(`Error in handleConnection: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;
      if (userId) {
        this.handleUserDisconnection(client, userId);
      }
    } catch (error) {
      this.logger.error(`Error in handleDisconnect: ${error.message}`);
    }
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(@MessageBody() dto: SendMessageRequestDto, @ConnectedSocket() client: Socket): Promise<void> {
    this.logger.log(`Handling sendMessage: ${JSON.stringify(dto)}`);

    try {
      // Create and execute the SendMessage command
      const command = new SendMessageCommand(dto.content, dto.userId, dto.conversationId, new Date());

      await this.commandBus.execute(command);

      // Get conversation participants
      const participants = await this.conversationRepository.getParticipants(dto.conversationId);

      // Update all participants
      await this.updateParticipants(participants, dto.conversationId);

      this.logger.log("Message sent and participants updated successfully");
    } catch (error) {
      this.logger.error(`Failed to handle sendMessage: ${error.message}`);
      // Emit error to the sender
      this.emitToUser(dto.userId, "sendMessageError", {
        error: "Failed to send message",
        originalMessage: dto,
      });
    }
  }

  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  private async handleUserConnection(client: Socket, userId: string): Promise<void> {
    client.join(`user:${userId}`);
    this.connectedUsers.set(userId, client);
    this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
  }

  private handleUserDisconnection(client: Socket, userId: string): void {
    client.leave(`user:${userId}`);
    this.connectedUsers.delete(userId);
    this.logger.log(`Client disconnected: ${client.id} for user: ${userId}`);
  }

  private async updateParticipants(participants: string[], conversationId: string): Promise<void> {
    for (const userId of participants) {
      try {
        // Get updated conversation list for the user
        const conversations = await this.conversationRepository.getUserConversations(userId);

        // Get updated conversation details
        const conversationDetails = await this.conversationRepository.findById(new ConversationId(conversationId));

        // Emit updates to the user
        this.emitToUser(userId, "loadConversationListSuccess", conversations);
        this.emitToUser(userId, "sendMessageSuccess", conversationDetails);
      } catch (error) {
        this.logger.error(`Failed to update participant ${userId}: ${error.message}`);
      }
    }
  }
}

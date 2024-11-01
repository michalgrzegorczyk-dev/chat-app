// src/interfaces/websocket/chat.gateway.ts
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

import { SendMessageCommand } from "../application/commands/send-message.command";
import { CONVERSATION_REPOSITORY, ConversationRepository } from "../domain/conversation/repositories/conversation.repository";
import { ConversationId } from "../domain/conversation/value-objects/conversation-id";
import { MESSAGE_REPOSITORY, MessageRepository } from "../domain/messages/repositories/message.repository";

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
    try {
      this.logger.log(`Handling sendMessage: ${JSON.stringify(dto)}`);

      // Create and execute command
      const command = new SendMessageCommand(dto.content, dto.userId, dto.conversationId, new Date(), dto.localMessageId);

      // Execute command which will trigger MessageSentEvent
      await this.commandBus.execute(command);

      // Get conversation participants
      const participants = await this.conversationRepository.getParticipants(dto.conversationId);

      // For each participant, emit the updates
      for (const participantId of participants) {
        // Get updated conversation list
        const updatedConversations = await this.conversationRepository.getUserConversations(participantId);

        // Get the conversation details with latest messages
        const conversationDetails = await this.conversationRepository.findById(new ConversationId(dto.conversationId));

        // Emit the updates to the participant
        if (this.isUserConnected(participantId)) {
          // Update conversation list
          this.emitToUser(participantId, "loadConversationListSuccess", updatedConversations);

          // Send new message
          this.emitToUser(participantId, "sendMessageSuccess", {
            conversationId: dto.conversationId,
            messageList: conversationDetails.messageList,
            message: {
              content: dto.content,
              sender_id: dto.userId,
              local_message_id: dto.localMessageId,
              created_at: new Date().toISOString(),
            },
          });
        }
      }
    } catch (error) {
      this.logger.error(`Failed to handle send message: ${error.message}`);
      this.emitToUser(dto.userId, "sendMessageError", {
        error: error.message,
        originalMessage: dto,
      });
    }
  }

  async handleConnection(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;
      if (!userId) {
        this.logger.error("User ID not provided in connection");
        client.disconnect();
        return;
      }

      // Add user to their room and connected users map
      await this.handleUserConnection(client, userId);

      // Send initial conversation list
      const conversations = await this.conversationRepository.getUserConversations(userId);
      this.emitToUser(userId, "loadConversationListSuccess", conversations);

      this.logger.log(`Client connected and initialized: ${client.id} for user: ${userId}`);
    } catch (error) {
      this.logger.error(`Error in handleConnection: ${error.message}`);
      client.disconnect();
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

  @SubscribeMessage("typing")
  async handleTyping(@MessageBody() data: { userId: string; conversationId: string; isTyping: boolean }, @ConnectedSocket() client: Socket): Promise<void> {
    const participants = await this.conversationRepository.getParticipants(data.conversationId);

    for (const participantId of participants) {
      if (participantId !== data.userId) {
        this.emitToUser(participantId, "userTyping", {
          userId: data.userId,
          conversationId: data.conversationId,
          isTyping: data.isTyping,
        });
      }
    }
  }

  private async handleUserConnection(client: Socket, userId: string): Promise<void> {
    client.join(`user:${userId}`);
    this.connectedUsers.set(userId, client);
  }

  private handleUserDisconnection(client: Socket, userId: string): void {
    client.leave(`user:${userId}`);
    this.connectedUsers.delete(userId);
  }

  emitToUser(userId: string, event: string, data: any): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  private isUserConnected(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  async updateMessagesFromQueue(userId: string, conversationId: string, messages: SendMessageRequestDto[]): Promise<void> {
    for (const message of messages) {
      await this.handleSendMessage(message, this.connectedUsers.get(userId));
    }
  }
}

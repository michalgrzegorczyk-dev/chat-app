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

import { SendMessageCommand } from "../../application/message/commands/send-message.command";
import { CONVERSATION_REPOSITORY, ConversationRepository } from "../../domain/conversation/repositories/conversation.repository";
import { MESSAGE_REPOSITORY, MessageRepository } from "../../domain/message/repositories/message.repository.interface";
import { SendMessageRequestDto } from "../../shared/dto/message/send-message.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  readonly #logger = new Logger(ChatGateway.name);
  readonly #connectedUsers: Map<string, Socket> = new Map();

  constructor(
    private readonly commandBus: CommandBus,
    @Inject(CONVERSATION_REPOSITORY)
    private readonly conversationRepository: ConversationRepository,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: MessageRepository,
  ) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      this.#logger.error("User ID not provided in handshake connection.");
      client.disconnect();
      return;
    }
    client.join(`user:${userId}`);
    this.#logger.log(`Client connected: ${client.id} for user: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.query.userId as string;
      if (userId) {
        this.handleUserDisconnection(client, userId);
      }
    } catch (error) {
      this.#logger.error(`Error in handleDisconnect: ${error.message}`);
    }
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(@MessageBody() dto: SendMessageRequestDto, @ConnectedSocket() client: Socket): Promise<void> {
    this.#logger.log(`Message Received`);
    const userId = "06b3db73-85b6-4c16-8dda-6757d00ff10f";
    this.#logger.log(`Message Received`, userId);
    // Check if user has joined the conversation room
    const isInRoom = client.rooms.has(`conversation:${dto.conversationId}`);
    if (!isInRoom) {
      this.#logger.warn(`User ${userId} attempted to send message without joining conversation ${dto.conversationId}`);
      client.emit("error", { message: "Please join the conversation first" });
      return;
    } else {
      this.#logger.log(`User ${userId} is in conversation ${dto.conversationId}`);
    }

    await this.commandBus.execute(new SendMessageCommand(dto.content, dto.userId, dto.conversationId, dto.timestamp || new Date(), dto.localMessageId));
    this.#logger.log("Message command executed successfully");
  }

  @SubscribeMessage("joinConversation")
  async handleJoinConversation(client: Socket, conversationId: string) {
    const userId = client.handshake.query.userId as string;
    console.log("Joining conversation", conversationId);

    // Verify user has access to this conversation
    const participants = await this.conversationRepository.getParticipants(conversationId);
    if (!participants.includes(userId)) {
      return;
    }

    // Leave previous conversation if any
    const rooms = client.rooms;
    for (const room of rooms) {
      if (room.startsWith("conversation:")) {
        client.leave(room);
      }
    }

    // Join new conversation room
    client.join(`conversation:${conversationId}`);
    this.#logger.log(`User ${userId} joined conversation ${conversationId}`);
  }

  private handleUserDisconnection(client: Socket, userId: string): void {
    client.leave(`user:${userId}`);
    this.#connectedUsers.delete(userId);
    this.#logger.log(`Client disconnected: ${client.id} for user: ${userId}`);
  }

  emitToConversation(conversationId: string, event: string, data: any): void {
    this.server.to(`conversation:${conversationId}`).emit(event, data);
  }
}

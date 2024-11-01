// import { SendMessageRequestDto } from "@chat-app/dtos";
// import { Logger } from "@nestjs/common";
// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";
//
// import { SupabaseService } from "./supabase.service";
//
// @WebSocketGateway({
//   cors: {
//     origin: "*",
//   },
// })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer() server: Server;
//   map = {
//     "1": "18cdf29a-2a91-4490-9b18-0d9c5bd4812c",
//   };
//   private logger = new Logger("ChatGateway");
//
//   constructor(private supabaseService: SupabaseService) {}
//
//   async handleConnection(client: Socket) {
//     try {
//       const userId = client.handshake.query.userId as string;
//       if (!userId) {
//         this.logger.error("User ID not provided in connection");
//         client.disconnect();
//         return;
//       }
//       client.join(`user:${userId}`);
//       this.logger.log(`Client connected: ${client.id} for user: ${userId}`);
//     } catch (error) {
//       this.logger.error(`Error in handleConnection: ${error.message}`);
//     }
//   }
//
//   async handleDisconnect(client: Socket) {
//     const userId = client.handshake.query.userId as string;
//     if (userId) {
//       client.leave(`user:${userId}`);
//       this.logger.log(`Client disconnected: ${client.id} for user: ${userId}`);
//     }
//   }
//
//   @SubscribeMessage("sendMessage")
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
//   async handleSendMessage(@MessageBody() requestDto: SendMessageRequestDto, @ConnectedSocket() client: Socket): Promise<void> {
//     await this.supabaseService.updateConversationList(requestDto);
//     const savedMessage = await this.supabaseService.saveMessage(requestDto);
//     const conversationUsers = await this.supabaseService.getUserIdListFromConversation(requestDto.conversationId);
//
//     for (const userId of conversationUsers) {
//       const conversations = await this.supabaseService.getConversationsByUserId(userId);
//       this.server.to(`user:${userId}`).emit("loadConversationListSuccess", conversations);
//       this.server.to(`user:${userId}`).emit("sendMessageSuccess", savedMessage);
//     }
//   }
//
//   async updateMessagesFromQueue(userId, conversationId, queue) {
//     for (const message of queue) {
//       await this.handleSendMessage(message, null);
//     }
//   }
// }

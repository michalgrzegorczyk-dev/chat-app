// import { WebSocketGateway, WebSocketServer, SubscribeMessage } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";
// import { ConversationService } from "../../application/services/conversation.service";
// import { MessageService } from "../../application/services/message.service";
//
// @WebSocketGateway({
//   cors: { origin: "*" },
// })
// export class ChatGateway {
//   @WebSocketServer()
//   private server: Server;
//
//   constructor(
//     private conversationService: ConversationService,
//     private messageService: MessageService,
//   ) {}
//
//   async handleConnection(client: Socket) {
//     const userId = client.handshake.query.userId as string;
//     if (!userId) {
//       client.disconnect();
//       return;
//     }
//     client.join(`user:${userId}`);
//   }
//
//   @SubscribeMessage("sendMessage")
//   async handleMessage(client: Socket, payload: SendMessageDto) {
//     const message = await this.messageService.sendMessage(payload);
//     const conversationUsers = await this.conversationService.getConversationMembers(payload.conversationId);
//
//     for (const userId of conversationUsers) {
//       const conversations = await this.conversationService.getUserConversations(userId);
//       this.server.to(`user:${userId}`).emit("conversationsUpdated", conversations);
//       this.server.to(`user:${userId}`).emit("messageReceived", message);
//     }
//   }
// }

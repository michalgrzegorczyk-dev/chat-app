// @Injectable()
// export class MessageService {
//   constructor(
//     private messageRepository: MessageRepository,
//     private conversationService: ConversationService,
//   ) {}
//
//   async sendMessage(dto: SendMessageDto): Promise<Message> {
//     const message = new Message(
//       new MessageId(dto.messageId),
//       await this.userService.getUser(dto.senderId),
//       new ConversationId(dto.conversationId),
//       new MessageContent(dto.content),
//       MessageStatus.SENT,
//       new Date(),
//     );
//
//     const savedMessage = await this.messageRepository.save(message);
//     await this.conversationService.updateLastMessage(dto.conversationId, savedMessage);
//
//     return savedMessage;
//   }
//
//   async getConversationMessages(conversationId: string): Promise<Message[]> {
//     return this.messageRepository.findByConversationId(new ConversationId(conversationId));
//   }
// }

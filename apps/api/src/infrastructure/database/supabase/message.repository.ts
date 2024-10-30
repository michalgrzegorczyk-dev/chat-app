// @Injectable()
// export class SupabaseMessageRepository implements MessageRepository {
//   constructor(private supabase: SupabaseClient) {}
//
//   async save(message: Message): Promise<Message> {
//     const { data, error } = await this.supabase
//       .from("message")
//       .insert({
//         conversation_id: message.getConversationId().getValue(),
//         sender_id: message.getSender().getId(),
//         content: message.getContent(),
//         status: message.getStatus(),
//         created_at: new Date().toISOString(),
//       })
//       .single();
//
//     if (error) throw new Error(error.message);
//     return message;
//   }
//
//   async findByConversationId(conversationId: ConversationId): Promise<Message[]> {
//     const { data } = await this.supabase
//       .from("message")
//       .select(
//         `
//         id,
//         content,
//         created_at,
//         status,
//         sender:sender_id(id, name, profile_photo_url)
//       `,
//       )
//       .eq("conversation_id", conversationId.getValue())
//       .order("created_at", { ascending: true });
//
//     return (
//       data?.map(
//         (msg) =>
//           new Message(
//             new MessageId(msg.id),
//             new User(msg.sender.id, msg.sender.name, msg.sender.profile_photo_url),
//             conversationId,
//             new MessageContent(msg.content),
//             msg.status as MessageStatus,
//             new Date(msg.created_at),
//           ),
//       ) ?? []
//     );
//   }
// }

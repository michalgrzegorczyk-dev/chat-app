import {Injectable} from '@nestjs/common';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import { SendMessageDto } from '@chat-app/dtos';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    }

    async getConversationsByUserId(userId: string): Promise<any> {
        const {data} = await this.supabase
            .from('conversationuser')
            .select(`
            conversation_id,
            conversation:conversation_id(name, avatar_url, chat_type, last_message, last_message_timestamp, last_message_sender_id),
            other_user:conversation_id(users!inner(id, name, profile_photo_url))
        `)
            .eq('user_id', userId)
            .neq('other_user.users.id', userId);

        const x = data.map((item: any) => {
            const isOneOnOne = item.conversation.chat_type === 'single';

            return {
                conversationId: item.conversation_id,
                avatarUrl: isOneOnOne ? item.other_user.users[0].profile_photo_url : item.conversation.avatar_url,
                name: isOneOnOne ? item.other_user.users[0].name : item.conversation.name,
                chatType: item.conversation.chat_type,
                lastMessageContent: item.conversation.last_message,
                lastMessageTimestamp: item.conversation.last_message_timestamp,
                lastMessageSenderId: item.conversation.last_message_sender_id,
            };
        });

        return x;
    }

    async saveMessage(message: any): Promise<any> {
        try {
            const {data, error} = await this.supabase
                .from('message')
                .insert({
                    conversation_id: message.conversationId,
                    sender_id: message.userId,
                    content: message.content,
                    created_at: message.timestamp,
                    status: "sent",
                })
                .select()
                .single();

            if (error) {
                throw new Error(`Error saving message: ${error.message}`);
            }

            return data;
        } catch (error) {
            console.error('Error in saveMessage:', error);
            throw error;
        }
    }

    async getRecentMessages(userId: string, conversationId: string): Promise<any> {
        const {data, error} = await this.supabase
            .from('message')
            .select(`
      id,
      content,
      created_at,
      sender:users(name, id, profile_photo_url),
      conversation:conversation!inner(id)
    `)
            .eq('conversation_id', conversationId)
            .order('created_at', {ascending: true});

        if (error) {
            console.error('Error fetching messages:', error);
            return null;
        }

        const x = {
            conversationId: conversationId,
            messageList: data.map((msg: any) => ({
                message_id: msg.id,
                content: msg.content,
                created_at: msg.created_at,
                sender_id: String(msg.sender.id)
            })),
            memberList: this.getUniqueSenders(data)
        };
        return x;
    }

    getUniqueSenders(data: any): any {
        return Array.from(new Map(data.map(msg => [msg.sender.id, msg.sender])).values());
    }

    async getAllUsers() {
        try {
            const {data, error} = await this.supabase
                .from('users')
                .select('*');
            return data;
        } catch (error) {

        }
    }



  async updateConversationList(sendMessageDto: SendMessageDto): Promise<void> {
    await this.supabase
      .from('conversation')
      .update({
        last_message: sendMessageDto.content,
        last_message_timestamp: sendMessageDto.timestamp,
        last_message_sender_id: sendMessageDto.userId
      })
      .eq('id', sendMessageDto.conversationId)
  }

  async getUsersInConversation(conversationId: string): Promise<string[]> {
      const { data, error } = await this.supabase
        .from('conversationuser')
        .select('user_id')
        .eq('conversation_id', conversationId);

    console.log(data);
    console.log(conversationId);

      return data.map(item => item.user_id);
  }
}

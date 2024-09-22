import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SendMessageDto,
  ConversationDetailsDto,
  MemberDto,
  MessageDto,
  ConversationListElementDto
} from '@chat-app/dtos';
import { MessageDbModel } from './model/conversation.model';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }

  async getConversationsByUserId(userId: string): Promise<ConversationListElementDto[]> {
    const { data } = await this.supabase
      .from('conversationuser')
      .select(`
            conversation_id,
            conversation:conversation_id(name, avatar_url, chat_type, last_message, last_message_timestamp, last_message_sender_id),
            other_user:conversation_id(users!inner(id, name, profile_photo_url))
        `)
      .eq('user_id', userId)
      .neq('other_user.users.id', userId);

    return data.map((item: any) => {
      const isOneOnOne = item.conversation.chat_type === 'single';

      return {
        conversationId: item.conversation_id,
        avatarUrl: isOneOnOne ? item.other_user.users[0].profile_photo_url : item.conversation.avatar_url,
        name: isOneOnOne ? item.other_user.users[0].name : item.conversation.name,
        chatType: item.conversation.chat_type,
        lastMessageContent: item.conversation.last_message,
        lastMessageTimestamp: item.conversation.last_message_timestamp,
        lastMessageSenderId: item.conversation.last_message_sender_id
      };
    }).sort((a, b) => b.lastMessageTimestamp.localeCompare(a.lastMessageTimestamp));
  }

  async saveMessage(message: SendMessageDto): Promise<MessageDto> {
      const { data } = await this.supabase
        .from('message')
        .insert({
          conversation_id: message.conversationId,
          sender_id: message.userId,
          content: message.content,
          created_at: message.timestamp,
          status: 'sent'
        })
        .select()
        .single();

      return data;
  }

  async getConversation(userId: string, conversationId: string): Promise<ConversationDetailsDto> {
    const data = await this.supabase
      .from('message')
      .select(`
              id,
              content,
              created_at,
              sender:users(name, id, profile_photo_url),
              conversation:conversation!inner(id)
            `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    //TODO: check how to type objects from supabase etc.
    // const conversationListDb: ConversationDbModel[] = data as any;
    const messageListDb: MessageDbModel[] = data.data as any;

    return {
      conversationId: conversationId,
      messageList: messageListDb.map(msg => ({
        message_id: String(msg.id),
        content: msg.content,
        created_at: msg.created_at,
        sender_id: String(msg.sender.id),
        status: 'sent', //todo
      })),
      memberList: this.getUniqueSenders(messageListDb)
    };
  }

  getUniqueSenders(data: any): MemberDto[] {
    return Array.from(
      new Map(
        data.map((msg: any) => [msg.sender.id, msg.sender])
      ).values()
    ) as MemberDto[];
  }

  //todo remove after auth implementation
  async getAllUsers() {
      const {data} = await this.supabase
        .from('users')
        .select('*');
      return data;
  }

  async updateConversationList(sendMessageDto: SendMessageDto): Promise<void> {
    await this.supabase
      .from('conversation')
      .update({
        last_message: sendMessageDto.content,
        last_message_timestamp: sendMessageDto.timestamp,
        last_message_sender_id: sendMessageDto.userId
      })
      .eq('id', sendMessageDto.conversationId);
  }

  async getUserIdListFromConversation(conversationId: string): Promise<string[]> {
    const { data } = await this.supabase
      .from('conversationuser')
      .select('user_id')
      .eq('conversation_id', conversationId);
    return data.map(item => item.user_id);
  }
}

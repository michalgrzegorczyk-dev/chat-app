import { Controller, Get, Headers, Query, Param } from "@nestjs/common";
import { ChatGateway } from './chat.gateway';
import { ConversationDto } from "../serverDtos/conversation.dto";

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

@Controller('chat')
export class ChatController {
    constructor(private chatGateway: ChatGateway) {}

    @Get('users')
    async getUsers(): Promise<any> {
        await delay(0); // 2 second delay
        return await this.chatGateway.getAllUsers();
    }

    @Get('conversations')
    async getConversations(@Headers('X-User-Id') userId: string): Promise<ConversationDto[]> {
        await delay(0); // 2 second delay
        return await this.chatGateway.getConversations(userId);
    }

    @Get('conversations/:conversationId')
    async getConversationDetails(@Headers('X-User-Id') userId: string, @Param('conversationId') conversationId: string) {
        await delay(0); // 2 second delay
        return await this.chatGateway.getRecentMessages(userId, conversationId);
    }
}

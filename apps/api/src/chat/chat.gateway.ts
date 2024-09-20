import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    OnGatewayConnection
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {SupabaseService} from '../db/supabase.service';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private supabaseService: SupabaseService) {
    }

    async handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(@MessageBody() message: any) {
        const data = await this.supabaseService.saveMessage(message);
        this.server.emit('newMessage', data);
    }

    async getConversationDetails(username: string, friendUsername: string) {
        return await this.supabaseService.getRecentMessages(username, friendUsername);
    }

    getConversations(username: string) {
        return this.supabaseService.getConversationsByUserId(username);
    }

    async getAllUsers() {
        return this.supabaseService.getAllUsers();
    }
}

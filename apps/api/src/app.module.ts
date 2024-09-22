import {Module} from '@nestjs/common';
import {ChatGateway} from './chat/chat.gateway';
import {SupabaseService} from "./chat/supabase.service";
import {ConfigModule} from "@nestjs/config";
import {ChatController} from "./chat/chat.controller";

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true
    })],
    controllers: [ChatController],
    providers: [ChatGateway, SupabaseService],
})
export class AppModule {
}

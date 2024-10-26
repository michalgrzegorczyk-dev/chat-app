import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ChatController } from './chat/chat.controller';
import { ChatGateway } from './chat/chat.gateway';
import { SupabaseService } from './chat/supabase.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  })],
  controllers: [ChatController],
  providers: [ChatGateway, SupabaseService]
})
export class AppModule {
}

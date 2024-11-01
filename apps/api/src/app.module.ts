import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { ConversationService } from "./application/services/conversation.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { JwtStrategy } from "./auth/jwt.strategy";
import { SupabaseService } from "./chat/supabase.service";
import { CONVERSATION_REPOSITORY } from "./domain/conversation/repositories/conversation.repository";
import { SupabaseConversationRepository } from "./infrastructure/database/supabase/conversation.repository";
import { ChatController } from "./interfaces/http/chat.controller";
import { ChatGateway } from "./interfaces/websocket/chat.gateway";
import { CqrsModule, QueryBus } from "@nestjs/cqrs";
import { USER_REPOSITORY } from "./domain/user/repositiories/user.repository";
import { MESSAGE_REPOSITORY } from "./domain/messages/repositories/message.repository";
import { SupabaseMessageRepository } from "./infrastructure/database/supabase/message.repository";
import { SupabaseUserRepository } from "./infrastructure/database/supabase/user.repository";
import { SendMessageHandler } from "./application/commands/handlers/send-message.handler";
import { MessageSentHandler } from "./application/events/handlers/message-sent.handler";

const CommandHandlers = [SendMessageHandler];
const EventHandlers = [MessageSentHandler];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: "your-secret-key",
      signOptions: { expiresIn: "1h" },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController, ChatController],
  providers: [
    ...CommandHandlers,
    ...EventHandlers,
    ConversationService,
    ChatGateway,
    AuthService,
    JwtStrategy,
    SupabaseService,
    SupabaseConversationRepository,
    SupabaseMessageRepository,
    SupabaseUserRepository,
    QueryBus,
    {
      provide: CONVERSATION_REPOSITORY,
      useClass: SupabaseConversationRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: SupabaseUserRepository,
    },
    {
      provide: MESSAGE_REPOSITORY,
      useClass: SupabaseMessageRepository,
    },
  ],
})
export class AppModule {}

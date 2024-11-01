import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule, QueryBus } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./application/auth/auth.service";
import { SendMessageHandler } from "./application/commands/handlers/send-message.handler";
import { MessageSentHandler } from "./application/events/handlers/message-sent.handler";
import { ConversationService } from "./application/services/conversation.service";
import { AUTH_REPOSITORY } from "./domain/auth/interfaces/auth.repository";
import { CONVERSATION_REPOSITORY } from "./domain/conversation/repositories/conversation.repository";
import { MESSAGE_REPOSITORY } from "./domain/messages/repositories/message.repository";
import { USER_REPOSITORY } from "./domain/user/repositiories/user.repository";
import { JwtStrategy } from "./infrastructure/auth/strategies/jwt.strategy";
import { SupabaseConversationRepository } from "./infrastructure/database/supabase/conversation.repository";
import { SupabaseMessageRepository } from "./infrastructure/database/supabase/message.repository";
import { SupabaseUserRepository } from "./infrastructure/database/supabase/user.repository";
import { AuthController } from "./interfaces/http/auth.controller";
import { ChatController } from "./interfaces/http/chat.controller";
import { ChatGateway } from "./interfaces/websocket/chat.gateway";
import { SupabaseService } from "./infrastructure/database/supabase/supabase.service";
import { SupabaseAuthRepository } from "./infrastructure/database/supabase/auth.repository";

const CommandHandlers = [SendMessageHandler];
const EventHandlers = [MessageSentHandler];

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: "your-secret-key",
      signOptions: { expiresIn: "30s" },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController, ChatController],
  providers: [
    AuthService,
    ...CommandHandlers,
    ...EventHandlers,
    ConversationService,
    ChatGateway,
    JwtStrategy,
    SupabaseConversationRepository,
    SupabaseMessageRepository,
    SupabaseUserRepository,
    SupabaseService,
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
    {
      provide: AUTH_REPOSITORY,
      useClass: SupabaseAuthRepository,
    },
  ],
})
export class AppModule {}

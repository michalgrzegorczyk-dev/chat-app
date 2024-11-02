import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule, QueryBus } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./application/auth/auth.service";
import { SendMessageHandler } from "./application/message/commands/handlers/send-message.command-handler";
import { MessageSentHandler } from "./application/message/events/handlers/message-sent.event-handler";
import { ConversationApplicationService } from "./application/conversation/services/conversation-application.service";
import { AUTH_REPOSITORY } from "./application/auth/interfaces/auth.repository";
import { CONVERSATION_REPOSITORY } from "./domain/conversation/repositories/conversation.repository";
import { MESSAGE_REPOSITORY } from "./domain/message/repositories/message.repository.interface";
import { USER_REPOSITORY } from "./domain/user/repositories/user.repository.interface";
import { JwtStrategy } from "./infrastructure/security/strategies/jwt.strategy";
import { SupabaseConversationRepository } from "./infrastructure/persistence/supabase/supabase-conversation.repository";
import { SupabaseMessageRepository } from "./infrastructure/persistence/supabase/supabase-message.repository";
import { SupabaseUserRepository } from "./infrastructure/persistence/supabase/supabase-user.repository";
import { AuthController } from "./interfaces/http/auth.controller";
import { ChatController } from "./interfaces/http/chat.controller";
import { ChatGateway } from "./infrastructure/websocket/chat.gateway";
import { SupabaseService } from "./infrastructure/persistence/supabase/supabase.service";
import { SupabaseAuthRepository } from "./infrastructure/persistence/supabase/supabase-auth.repository";

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
    ConversationApplicationService,
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

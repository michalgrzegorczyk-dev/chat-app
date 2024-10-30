import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { JwtStrategy } from "./auth/jwt.strategy";
import { ChatControllerOLD } from "./chat/chatControllerOLD";
import { ChatGateway } from "./chat/chat.gateway";
import { SupabaseService } from "./chat/supabase.service";

@Module({
  imports: [
    JwtModule.register({
      secret: "your-secret-key", // In production, use environment variable
      signOptions: { expiresIn: "1h" },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ChatControllerOLD, AuthController],
  providers: [ChatGateway, SupabaseService, AuthService, JwtStrategy],
})
export class AppModule {}

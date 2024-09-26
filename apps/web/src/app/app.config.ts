import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ChatSyncStrategy } from '@chat-app/domain';
import { CHAT_SYNC_STRATEGY_TOKEN } from './layout/chat/chat.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    {
      provide: CHAT_SYNC_STRATEGY_TOKEN,
      useClass: ChatSyncStrategy
    },
  ]
};

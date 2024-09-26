import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CHAT_SYNC_STRATEGY_TOKEN } from './layout/chat/chat.component';
import {
  WithDataSync
} from '../../../../libs/web/chat/data-access-chat/src/lib/application/data-sync-strategy/with-data-sync.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    {
      provide: CHAT_SYNC_STRATEGY_TOKEN,
      useClass: WithDataSync
    },
  ]
};

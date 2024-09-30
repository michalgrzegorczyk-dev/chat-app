import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { DATA_SYNC_STRATEGY_TOKEN,WithDataSync } from '@chat-app/domain';

import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    {
      provide: DATA_SYNC_STRATEGY_TOKEN,
      useClass: WithDataSync
    }
  ]
};

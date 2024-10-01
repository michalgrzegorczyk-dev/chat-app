import { InjectionToken } from '@angular/core';

import { DataSyncStrategy } from './data-sync.strategy';

export const DATA_SYNC_STRATEGY_TOKEN = new InjectionToken<DataSyncStrategy>('syncStrategy');

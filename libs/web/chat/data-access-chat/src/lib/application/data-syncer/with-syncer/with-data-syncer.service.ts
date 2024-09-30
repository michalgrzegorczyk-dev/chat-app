import { inject,Injectable } from '@angular/core';

import { MessageSend } from '../../../models/message-send.type';
import { DataSyncStrategy } from '../strategy/data-sync.strategy';

import { DataSyncer } from './data-syncer.chat';

@Injectable()
export class WithDataSync implements DataSyncStrategy {
  private readonly dataSyncer = inject(DataSyncer)

  addMessageToClientDb(message: MessageSend) {
    this.dataSyncer.addMessageToClientDb(message);
  }
}

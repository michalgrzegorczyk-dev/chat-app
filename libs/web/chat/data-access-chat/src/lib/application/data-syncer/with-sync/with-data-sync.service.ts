import { Injectable, inject } from '@angular/core';
import { DataSyncer } from './data-syncer.chat';
import { DataSyncStrategy } from '../strategy/data-sync.strategy';
import { MessageSend } from '../../../models/message-send.type';

@Injectable()
export class WithDataSync implements DataSyncStrategy {
  private readonly dataSyncer = inject(DataSyncer)

  addMessageToClientDb(message: MessageSend) {
    this.dataSyncer.addMessageToClientDb(message);
  }
}

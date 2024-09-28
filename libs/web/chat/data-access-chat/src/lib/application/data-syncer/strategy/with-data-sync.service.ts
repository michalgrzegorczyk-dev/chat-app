import { Injectable, inject } from '@angular/core';
import { DataSyncer } from '../data-syncer.chat';
import { Observable } from 'rxjs';
import { DataSyncStrategy } from './data-sync.strategy';
import { MessageSend } from '../../../models/message-send.type';
import { ReceivedMessage } from '../../../models/message.type';

@Injectable()
export class WithDataSync implements DataSyncStrategy {
  private readonly dataSyncer = inject(DataSyncer)

  addMessageToClientDb(message: MessageSend) {
    this.dataSyncer.addMessageToClientDb(message);
  }

  sendQueuedMessage$(): Observable<MessageSend> {
    return this.dataSyncer.sendMessage$;
  }

  getMessageQueue$(): Observable<MessageSend[]> {
    return this.dataSyncer.queue$;
  }
}

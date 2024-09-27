import { Injectable, inject } from '@angular/core';
import { DataSyncerChat } from '../data-syncer.chat';
import { Observable } from 'rxjs';
import { DataSyncStrategy } from './data-sync.strategy';
import { MessageSend } from '../../../models/message-send.type';
import { ReceivedMessage } from '../../../models/message.type';

@Injectable()
export class WithDataSync implements DataSyncStrategy {
  private readonly chatSync = inject(DataSyncerChat)

  addMessageToQueue(message: MessageSend) {
    this.chatSync.addMessageToClientDb(message);
  }

  sendQueuedMessage$(): Observable<MessageSend> {
    return this.chatSync.sendMessage$;
  }

  // requestDataSync(): void {
  //   this.chatSync.requestDataSync();
  // }

  getMessageQueue$(): Observable<MessageSend[]> {
    return this.chatSync.queue$;
  }

  notifyMessageReceived(message: ReceivedMessage): void {
    this.chatSync.notifyMessageReceived(message);
  }

  getMessageReceived$(): Observable<ReceivedMessage> {
    return this.chatSync.messageSent$;
  }
}

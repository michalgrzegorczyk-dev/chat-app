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
    this.chatSync.addMessage(message);
  }

  sendQueuedMessage$(): Observable<MessageSend> {
    return this.chatSync.sendMessage$;
  }

  requestSync(): void {
    this.chatSync.requestSync();
  }

  getMessageQueue$(): Observable<MessageSend[]> {
    return this.chatSync.queue$;
  }

  notifyMessageSent(message: ReceivedMessage): void {
    this.chatSync.notifyMessageSent(message);
  }

  getMessageReceived$(): Observable<ReceivedMessage> {
    return this.chatSync.messageSent$;
  }
}

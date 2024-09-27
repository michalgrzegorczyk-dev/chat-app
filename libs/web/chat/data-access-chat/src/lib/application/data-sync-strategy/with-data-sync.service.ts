import { Injectable, inject } from '@angular/core';
import { ChatDataSync } from '../data-sync/chat.data-sync';
import { Observable } from 'rxjs';
import { DataSyncStrategy } from './data-sync.strategy';
import { MessageSend } from '../../models/message-send.type';
import { ReceivedMessage } from '../../models/message.type';

@Injectable()
export class WithDataSync implements DataSyncStrategy {
  private readonly chatSync = inject(ChatDataSync)

  addMessage(message: MessageSend) {
    this.chatSync.addMessage(message);
  }

  removeMessage(message: ReceivedMessage) {
    this.chatSync.removeMessage(message);
  }

  getSendMessage$(): Observable<MessageSend> {
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

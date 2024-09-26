import { Injectable, inject } from '@angular/core';
import { ChatDataSync } from '../data-sync/chat.data-sync';
import { MessageSend, ReceivedMessage, DataSyncStrategy } from '@chat-app/domain';
import { Observable } from 'rxjs';

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

  getQueue$(): Observable<MessageSend[]> {
    return this.chatSync.queue$;
  }

  notifyMessageSent(message: ReceivedMessage): void {
    this.chatSync.notifyMessageSent(message);
  }

  getMessageSent$(): Observable<ReceivedMessage> {
    return this.chatSync.messageSent$;
  }
}

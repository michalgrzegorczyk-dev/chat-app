import { MessageSend } from '../../models/message-send.type';
import { ReceivedMessage } from '../../models/message.type';
import { Observable, Subject } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { ChatSync } from './chat.sync';

export interface SyncStrategy {
  addMessage(message: MessageSend): void;
  removeMessage(message: ReceivedMessage): void;
  getSendMessage$(): Observable<MessageSend>;
  requestSync(): void;
}

@Injectable({
  providedIn: 'root'
})
export class ChatSyncStrategy implements SyncStrategy {
  private readonly chatSync = inject(ChatSync)

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
}

@Injectable({
  providedIn: 'root'
})
export class NoSyncStrategy implements SyncStrategy {
  private sendMessage$ = new Subject<MessageSend>();

  addMessage(message: MessageSend): void {
    // Do nothing
  }

  removeMessage(message: ReceivedMessage): void {
    // Do nothing
  }


  getSendMessage$(): Observable<MessageSend> {
    return this.sendMessage$;
  }

  requestSync(): void {

  }
}

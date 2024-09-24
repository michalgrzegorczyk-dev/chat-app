import { MessageSend, ReceivedMessage } from '@chat-app/domain';
import { Observable, Subject } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { ChatSync } from './chat.sync';

export interface SyncStrategy {
  addMessage(message: MessageSend): void;
  removeMessage(message: ReceivedMessage): void;
  getSendMessage$(): Observable<MessageSend>;
}

@Injectable({
  providedIn: 'root'
})
export class ChatSyncStrategy implements SyncStrategy {

  chatSync = inject(ChatSync)
  sendMessage$ = this.chatSync.sendMessage$;

  private sendMessage(message: MessageSend): void {
    this.chatSync.sendMessage(message);
  }

  addMessage(message: MessageSend) {
    this.chatSync.addMessage(message);
  }

  removeMessage(message: ReceivedMessage) {
    this.chatSync.removeMessage(message);
  }

  getSendMessage$(): Observable<MessageSend> {
    return this.chatSync.sendMessage$;
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
}

import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { DataSyncStrategy } from './data-sync.strategy';
import { MessageSend } from '../../models/message-send.type';
import { ReceivedMessage } from '../../models/message.type';

@Injectable({
  providedIn: 'root'
})
export class WithoutDataSync implements DataSyncStrategy {
  private sendMessage$ = new Subject<MessageSend>();

  addMessageToQueue(message: MessageSend): void {
    // Do nothing
  }

  removeMessageFromQueue(message: ReceivedMessage): void {
    // Do nothing
  }


  sendQueuedMessage$(): Observable<MessageSend> {
    return this.sendMessage$;
  }

  requestSync(): void {

  }

  getMessageQueue$(): Observable<MessageSend[]> {
    return of([])
  }

  getMessageReceived$(): Observable<ReceivedMessage> {
    return of();
  }

  notifyMessageSent(message: ReceivedMessage): void {
  }
}

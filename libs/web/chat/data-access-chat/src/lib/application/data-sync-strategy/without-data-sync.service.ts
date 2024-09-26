import { Injectable } from '@angular/core';
import { Subject, Observable, of } from 'rxjs';
import { MessageSend, ReceivedMessage, DataSyncStrategy } from '@chat-app/domain';

@Injectable({
  providedIn: 'root'
})
export class WithoutDataSync implements DataSyncStrategy {
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

  getQueue$(): Observable<MessageSend[]> {
    return of([])
  }

  getMessageSent$(): Observable<ReceivedMessage> {
    return of();
  }

  notifyMessageSent(message: ReceivedMessage): void {
  }
}

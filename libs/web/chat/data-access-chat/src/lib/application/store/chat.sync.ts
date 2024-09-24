import { Injectable } from '@angular/core';
import { MessageSend, ReceivedMessage } from '@chat-app/domain';
import { Observable, fromEvent, Subject } from 'rxjs';
import { NotifierService } from '@chat-app/ui-notifier';

@Injectable({ providedIn: 'root' })
export class ChatSync {
  sendMessage$ = new Subject<MessageSend>();
  readonly notifier: NotifierService;
  private queue: MessageSend[] = [];
  private isOnline$: Observable<Event>;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;
    this.isOnline$ = fromEvent(window, 'online');
    this.isOnline$.subscribe(() => {
      console.log('IM ONLINE !!!!');
      this.syncMessages();
    });
  }

  addMessage(message: MessageSend) {
    this.queue.push(message);
  }

  removeMessage(message: ReceivedMessage) {
    console.log(message.messageId);
    this.queue = this.queue.filter((msg: any) => msg.localMessageId !== message.localMessageId);
    console.log(this.queue);
  }

  private syncMessages() {
    while (this.queue.length > 0) {
      const message = this.queue.reverse().shift();
      if (message) {
        console.log('sending', message.localMessageId);
        this.sendMessage(message);
      }
    }
  }

  private sendMessage(message: MessageSend): void {
    this.sendMessage$.next(message);
  }
}

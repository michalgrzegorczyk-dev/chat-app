import { Injectable } from '@angular/core';
import { MessageSend } from '@chat-app/domain';
import { Observable, fromEvent, Subject } from 'rxjs';
import { NotifierService } from '@chat-app/ui-notifier';

@Injectable({
  providedIn: 'root'
})
export class MessageSyncService {

  private queue: MessageSend[] = [];
  private isOnline$: Observable<Event>;
  messageTrigger$ = new Subject<MessageSend>();
  messageTriggerSuccess$ = new Subject<MessageSend>();

  readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {
    this.notifier = notifierService;

    this.isOnline$ = fromEvent(window, 'online');

    this.isOnline$.subscribe(() => {
      console.log('IM ONLINE !!!!');
      this.syncMessages();
    });
  }

  scheduleMessage(message: MessageSend): void {
    if (navigator.onLine) {
      this.messageTriggerSuccess$.next(message);
    } else {
      this.notifier.notify('info', 'Message added to queue.')
      this.queue.push(message);
      this.saveToLocalStorage();
    }
  }

  private sendMessage(message: MessageSend): void {
    this.messageTrigger$.next(message);
  }

  private syncMessages(): void {
    this.loadFromLocalStorage();
    while (this.queue.length > 0) {
      const message = this.queue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('messageQueue', JSON.stringify(this.queue));
  }

  private loadFromLocalStorage(): void {
    const storedQueue = localStorage.getItem('messageQueue');
    if (storedQueue) {
      this.queue = JSON.parse(storedQueue);
    }
  }
}

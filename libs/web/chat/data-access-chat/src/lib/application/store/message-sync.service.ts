import { Injectable, inject } from '@angular/core';
import { ChatStore, MessageSend } from '@chat-app/domain';
import { Observable, fromEvent, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageSyncService {
  // private readonly chatStore = inject(ChatStore);

  private queue: MessageSend[] = [];
  private isOnline$: Observable<Event>;
  messageTrigger$ = new Subject<MessageSend>();

  constructor() {
    this.isOnline$ = fromEvent(window, 'online');

    this.isOnline$.subscribe(() => {
      console.log('IM ONLINE !!!!');
      this.syncMessages();
    });
  }

  scheduleMessage(message: MessageSend): void {
    if (navigator.onLine) {
      // this.messageTrigger$.next(message);
      // this.sendMessage(message);
    } else {
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

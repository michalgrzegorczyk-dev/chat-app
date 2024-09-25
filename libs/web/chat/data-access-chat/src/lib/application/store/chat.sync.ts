import { Injectable, NgZone } from '@angular/core';
import { MessageSend, ReceivedMessage } from '@chat-app/domain';
import { Observable, fromEvent, Subject } from 'rxjs';
import { NotifierService } from '@chat-app/ui-notifier';

@Injectable({ providedIn: 'root' })
export class ChatSync {
  sendMessage$ = new Subject<MessageSend>();
  readonly notifier: NotifierService;
  private queue: MessageSend[] = [];
  private isOnline$: Observable<Event>;
  private broadcastChannel: BroadcastChannel;


  constructor(notifierService: NotifierService, private ngZone: NgZone) {
    this.notifier = notifierService;
    this.isOnline$ = fromEvent(window, 'online');
    this.isOnline$.subscribe(() => {
      console.log('IM ONLINE !!!!');
      this.syncMessages();
    });

    this.broadcastChannel = new BroadcastChannel('chat_sync');
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'sync_request') {
        this.broadcastSyncData();
      } else if (event.data.type === 'sync_data') {
        console.log('received sync data');
        console.log(event.data.queue);
        // this.receiveSyncData(event.data.queue);
      }
    };

    // Set up visibility change listener
    document.addEventListener('visibilitychange', () => {
      this.ngZone.run(() => {
        if (!document.hidden) {
          this.onPageVisible();
        }
      });
    });
  }

  // New method to broadcast sync data to other tabs
  private broadcastSyncData() {
    this.broadcastChannel.postMessage({
      type: 'sync_data',
      queue: this.queue
    });
  }

  private onPageVisible() {
    console.log('Page is now visible');
    this.requestSync();
    // Add any other synchronization logic here
  }

  // New method to receive sync data from other tabs
  private receiveSyncData(receivedQueue: MessageSend[]) {
    this.queue = receivedQueue;
    // Trigger any necessary updates in your application
  }

  requestSync() {
    this.broadcastChannel.postMessage({ type: 'sync_request' });
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

  sendMessage(message: MessageSend): void {
    this.sendMessage$.next(message);
  }
}

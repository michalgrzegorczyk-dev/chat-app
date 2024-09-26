import { Injectable, NgZone } from '@angular/core';
import { MessageSend, ReceivedMessage } from '@chat-app/domain';
import { Observable, fromEvent, Subject, BehaviorSubject } from 'rxjs';
import { NotifierService } from '@chat-app/ui-notifier';

@Injectable({ providedIn: 'root' })
export class ChatSync {
  sendMessage$ = new Subject<MessageSend>();
  private queueSubject = new BehaviorSubject<MessageSend[]>([]);
  queue$ = this.queueSubject.asObservable();

  private readonly notifier: NotifierService;
  private isOnline$: Observable<Event>;
  private broadcastChannel: BroadcastChannel;
  private messageSentSubject = new Subject<ReceivedMessage>();
  messageSent$ = this.messageSentSubject.asObservable();
  constructor(notifierService: NotifierService, private ngZone: NgZone) {
    this.notifier = notifierService;
    this.isOnline$ = fromEvent(window, 'online');
    this.isOnline$.subscribe(() => {
      console.log('Online: Syncing messages');
      this.syncMessages();
    });

    this.broadcastChannel = new BroadcastChannel('chat_sync');
    this.broadcastChannel.onmessage = (event) => {
      console.log('on message',event.data.type );
      if (event.data.type === 'sync_request') {
        console.log('sync');
        this.broadcastSyncData();
      } else if (event.data.type === 'sync_data') {
        console.log(event.data.queue)
        this.receiveSyncData(event.data.queue);
      } else if (event.data.type === 'message_sent') {
        this.handleMessageSent(event.data.message);
      }
    };

    document.addEventListener('visibilitychange', () => {
      this.ngZone.run(() => {
        if (!document.hidden) {
          this.onPageVisible();
        }
      });
    });
  }

  private handleMessageSent(message: ReceivedMessage) {
    this.removeMessage(message);
    this.messageSentSubject.next(message);
  }

  private broadcastSyncData() {
    console.log('lol');
    this.broadcastChannel.postMessage({
      type: 'sync_data',
      queue: this.queueSubject.value
    });
  }

  private onPageVisible() {
    console.log('Page is now visible');
    this.requestSync();
  }

  private receiveSyncData(receivedQueue: MessageSend[]) {
    this.queueSubject.next(receivedQueue);
  }

  requestSync() {
    this.broadcastChannel.postMessage({ type: 'sync_request' });
  }

  addMessage(message: MessageSend) {
    const updatedQueue = [...this.queueSubject.value, message];
    this.queueSubject.next(updatedQueue);
    this.broadcastSyncData();
  }

  notifyMessageSent(message: ReceivedMessage) {
    this.broadcastChannel.postMessage({
      type: 'message_sent',
      message: message
    });
    this.handleMessageSent(message);
  }

  removeMessage(message: ReceivedMessage) {
    const updatedQueue = this.queueSubject.value.filter((msg: any) => msg.localMessageId !== message.localMessageId);
    this.queueSubject.next(updatedQueue);
    this.broadcastSyncData();
  }

  private syncMessages() {
    const currentQueue = this.queueSubject.value;
    while (currentQueue.length > 0) {
      const message = currentQueue.pop();
      if (message) {
        console.log('Sending', message.localMessageId);
        this.sendMessage(message);
      }
    }
    this.queueSubject.next(currentQueue);
    this.broadcastSyncData();
  }

  sendMessage(message: MessageSend): void {
    this.sendMessage$.next(message);
  }
}

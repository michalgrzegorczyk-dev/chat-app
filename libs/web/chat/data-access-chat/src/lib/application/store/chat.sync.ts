import { Injectable, NgZone } from '@angular/core';
import { MessageSend, ReceivedMessage } from '@chat-app/domain';
import { fromEvent, Subject, BehaviorSubject } from 'rxjs';

const BROADCAST_CHANNEL_TYPES = {
  SYNC_REQUEST: 'sync_request',
  SYNC_DATA: 'sync_data',
  MESSAGE_SENT: 'message_sent'
};

@Injectable({ providedIn: 'root' })
export class ChatSync {
  sendMessage$ = new Subject<MessageSend>();
  private queueSubject = new BehaviorSubject<MessageSend[]>([]);
  queue$ = this.queueSubject.asObservable();

  private broadcastChannel = new BroadcastChannel('chat_sync');
  private messageSentSubject = new Subject<ReceivedMessage>();
  messageSent$ = this.messageSentSubject.asObservable();

  constructor(private ngZone: NgZone) {
    fromEvent(window, 'online').subscribe(() => {
      console.log('Online: Syncing messages');
      this.syncMessages();
    });

    this.broadcastChannel.onmessage = (event) => {
      console.log('on message', event.data.type);
      if (event.data.type === BROADCAST_CHANNEL_TYPES.SYNC_REQUEST) {
        this.broadcastSyncData();
      } else if (event.data.type === BROADCAST_CHANNEL_TYPES.SYNC_DATA) {
        this.receiveSyncData(event.data.queue);
      } else if (event.data.type === BROADCAST_CHANNEL_TYPES.MESSAGE_SENT) {
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

  sendMessage(message: MessageSend): void {
    this.sendMessage$.next(message);
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
}

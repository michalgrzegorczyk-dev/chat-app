import { Injectable, inject } from '@angular/core';
import { MessageSend, ReceivedMessage } from '@chat-app/domain';
import { Subject, BehaviorSubject } from 'rxjs';
import { NetworkService } from './network.service';
import { PageVisibilityService } from './page-visibility.service';
import { BroadcastChannelService, BroadcastMessage } from './broadcast-channel.service';

const BROADCAST_CHANNEL_TYPES = {
  /**
   * Type for requesting synchronization of messages.
   */
  REQUEST_SYNC: 'request_sync',

  /**
   * Type for sending the current queue of messages to be synchronized.
   */
  SYNC_QUEUE_DATA: 'sync_queue_data',

  /**
   * Type for notifying that a message has been sent.
   */
  NOTIFY_MESSAGE_SENT: 'notify_message_sent'
};

@Injectable()
export class ChatDataSync {
  readonly sendMessage$ = new Subject<MessageSend>();
  private readonly queueSubject = new BehaviorSubject<MessageSend[]>([]);
  readonly queue$ = this.queueSubject.asObservable();

  private messageSentSubject = new Subject<ReceivedMessage>();
  readonly messageSent$ = this.messageSentSubject.asObservable();

  private readonly networkService = inject(NetworkService);
  private readonly pageVisibilityService = inject(PageVisibilityService);
  private readonly broadcastChannelService = inject(BroadcastChannelService);

  constructor() {
    this.networkService.getOnlineStatus().subscribe((isOnline) => {
      if (isOnline) {
        this.syncMessages();
      }
    });

    this.broadcastChannelService.onMessage().subscribe((message: BroadcastMessage) => this.handleBroadcastMessage(message));
    this.pageVisibilityService.onPageVisible().subscribe(() => this.onPageVisible());
  }

  addMessage(message: MessageSend) {
    const updatedQueue = [...this.queueSubject.value, message];
    this.queueSubject.next(updatedQueue);
    this.broadcastSyncData();
  }

  removeMessage(message: ReceivedMessage) {
    const updatedQueue = this.queueSubject.value.filter((msg: any) => msg.localMessageId !== message.localMessageId);
    this.queueSubject.next(updatedQueue);
    this.broadcastSyncData();
  }

  public requestSync() {
    this.broadcastChannelService.postMessage({
      type: BROADCAST_CHANNEL_TYPES.REQUEST_SYNC,
      payload: null
    });
  }

  public notifyMessageSent(message: ReceivedMessage) {
    this.broadcastChannelService.postMessage({
      type: BROADCAST_CHANNEL_TYPES.NOTIFY_MESSAGE_SENT,
      payload: message
    });
    this.handleMessageSent(message);
  }

  private handleMessageSent(message: ReceivedMessage) {
    this.removeMessage(message);
    this.messageSentSubject.next(message);
  }

  private onPageVisible() {
    console.log('Page is now visible');
    this.requestSync();
  }

  private receiveSyncData(receivedQueue: MessageSend[]) {
    this.queueSubject.next(receivedQueue);
  }

  private syncMessages() {
    if (this.networkService.isOnline()) {
      const currentQueue = this.queueSubject.value;
      while (currentQueue.length > 0) {
        const message = currentQueue.pop();
        if (message) {
          console.log('Sending', message.localMessageId);
          this.sendMessage$.next(message);
        }
      }
      this.queueSubject.next(currentQueue);
      this.broadcastSyncData();
    }
  }

  private handleBroadcastMessage(message: BroadcastMessage) {
    console.log('Received broadcast message', message.type);
    switch (message.type) {
      case BROADCAST_CHANNEL_TYPES.REQUEST_SYNC:
        this.broadcastSyncData();
        break;
      case BROADCAST_CHANNEL_TYPES.SYNC_QUEUE_DATA:
        this.receiveSyncData(message.payload);
        break;
      case BROADCAST_CHANNEL_TYPES.NOTIFY_MESSAGE_SENT:
        this.handleMessageSent(message.payload);
        break;
    }
  }

  private broadcastSyncData() {
    this.broadcastChannelService.postMessage({
      type: BROADCAST_CHANNEL_TYPES.SYNC_QUEUE_DATA,
      payload: this.queueSubject.value
    });
  }
}

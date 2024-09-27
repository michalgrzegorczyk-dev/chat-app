import { Injectable, inject } from '@angular/core';
import { MessageSend, ReceivedMessage } from '@chat-app/domain';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { NetworkService } from '../../util-network/network.service';
import { BroadcastChannelService } from '../../util-broadcast-channel/broadcast-channel.service';
import { BroadcastMessage } from '../../util-broadcast-channel/broadcast-message.type';

enum BroadcastChannelType {
  REQUEST_SYNC = 'request_sync',
  SYNC_QUEUE_DATA = 'sync_queue_data',
  NOTIFY_MESSAGE_SENT = 'notify_message_sent'
}

@Injectable()
export class DataSyncerChat {
  readonly sendMessage$ = new Subject<MessageSend>();

  private messageSentSubject = new Subject<ReceivedMessage>();
  readonly messageSent$: Observable<ReceivedMessage> = this.messageSentSubject.asObservable();

  private readonly queueSubject = new BehaviorSubject<MessageSend[]>([]);
  readonly queue$: Observable<MessageSend[]> = this.queueSubject.asObservable();

  private readonly networkService = inject(NetworkService);
  private readonly broadcastChannelService = inject(BroadcastChannelService);

  private readonly messageHandlers: Record<BroadcastChannelType, (payload: any) => void> = {
    [BroadcastChannelType.REQUEST_SYNC]: () => this.broadcastSyncData(),
    [BroadcastChannelType.SYNC_QUEUE_DATA]: (payload: MessageSend[]) => this.updateQueue(payload),
    [BroadcastChannelType.NOTIFY_MESSAGE_SENT]: (payload: ReceivedMessage) => this.handleMessageSent(payload)
  };

  constructor() {
    this.initializeNetworkListener();
    this.initializeBroadcastListener();
  }

  addMessage(message: MessageSend): void {
    this.updateQueue([...this.queueSubject.value, message]);
    this.broadcastSyncData();
  }

  requestSync(): void {
    this.broadcastMessage(BroadcastChannelType.REQUEST_SYNC);
  }

  notifyMessageSent(message: ReceivedMessage): void {
    this.broadcastMessage(BroadcastChannelType.NOTIFY_MESSAGE_SENT, message);
    this.handleMessageSent(message);
  }

  private initializeNetworkListener(): void {
    this.networkService.getOnlineStatus().subscribe((isOnline) => {
      if (isOnline) this.syncMessages();
    });
  }

  private initializeBroadcastListener(): void {
    this.broadcastChannelService.onMessage().subscribe((message) => {
      this.handleBroadcastMessage(message);
    });
  }

  private handleMessageSent(message: ReceivedMessage): void {
    this.messageSentSubject.next(message);
  }

  private updateQueue(newQueue: MessageSend[]): void {
    this.queueSubject.next(newQueue);
  }

  private syncMessages(): void {
    if (!this.networkService.isOnline()) {
      return;
    }

    const currentQueue = [...this.queueSubject.value];
    while (currentQueue.length > 0) {
      const message = currentQueue.pop();
      if (message) this.sendMessage$.next(message);
    }
    this.updateQueue(currentQueue);
    this.broadcastSyncData();
  }

  private handleBroadcastMessage(message: BroadcastMessage): void {
    const handler = this.messageHandlers[message.type as BroadcastChannelType];
    if (handler) {
      handler(message.payload);
    }
  }

  private broadcastSyncData(): void {
    this.broadcastMessage(BroadcastChannelType.SYNC_QUEUE_DATA, this.queueSubject.value);
  }

  private broadcastMessage(type: BroadcastChannelType, payload: any = null): void {
    this.broadcastChannelService.postMessage({ type, payload });
  }
}

import { MessageSend } from '../../models/message-send.type';
import { ReceivedMessage } from '../../models/message.type';
import { Observable } from 'rxjs';

export interface DataSyncStrategy {
  addMessageToQueue(message: MessageSend): void;
  removeMessageFromQueue(message: ReceivedMessage): void;
  sendQueuedMessage$(): Observable<MessageSend>;
  requestSync(): void;
  getMessageQueue$(): Observable<MessageSend[]>;
  notifyMessageSent(message: ReceivedMessage): void;
  getMessageReceived$(): Observable<ReceivedMessage>;
}



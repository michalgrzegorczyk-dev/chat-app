import { MessageSend } from '../../../models/message-send.type';
import { ReceivedMessage } from '../../../models/message.type';
import { Observable } from 'rxjs';

export interface DataSyncStrategy {
  addMessageToQueue(message: MessageSend): void;
  sendQueuedMessage$(): Observable<MessageSend>;
  getMessageQueue$(): Observable<MessageSend[]>;
  notifyMessageReceived(message: ReceivedMessage): void;
  getMessageReceived$(): Observable<ReceivedMessage>;
}



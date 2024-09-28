import { MessageSend } from '../../../models/message-send.type';
import { Observable } from 'rxjs';

export interface DataSyncStrategy {
  addMessageToClientDb(message: MessageSend): void;
  sendQueuedMessage$(): Observable<MessageSend>;
  getMessageQueue$(): Observable<MessageSend[]>;
}



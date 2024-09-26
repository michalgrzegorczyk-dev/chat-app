import { MessageSend } from '../../models/message-send.type';
import { ReceivedMessage } from '../../models/message.type';
import { Observable } from 'rxjs';

export interface DataSyncStrategy {
  addMessage(message: MessageSend): void;
  removeMessage(message: ReceivedMessage): void;
  getSendMessage$(): Observable<MessageSend>;
  requestSync(): void;
  getQueue$(): Observable<MessageSend[]>;
  notifyMessageSent(message: ReceivedMessage): void;
  getMessageSent$(): Observable<ReceivedMessage>;
}



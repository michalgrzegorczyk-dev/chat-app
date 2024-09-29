import { MessageSend } from '../../../models/message-send.type';

export interface DataSyncStrategy {
  addMessageToClientDb(message: MessageSend): void;
}



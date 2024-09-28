import { Injectable } from '@angular/core';
import { DataSyncStrategy } from '../strategy/data-sync.strategy';
import { MessageSend } from '../../../models/message-send.type';

@Injectable({
  providedIn: 'root'
})
export class WithoutDataSync implements DataSyncStrategy {

  addMessageToClientDb(message: MessageSend): void {
    // Do nothing
  }
}

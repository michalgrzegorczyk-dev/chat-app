import { Injectable } from '@angular/core';

import { MessageSend } from '../../../models/message-send.type';
import { DataSyncStrategy } from '../strategy/data-sync.strategy';

@Injectable({
  providedIn: 'root'
})
export class WithoutDataSync implements DataSyncStrategy {

  addMessageToClientDb(message: MessageSend): void {
    // Do nothing
  }
}

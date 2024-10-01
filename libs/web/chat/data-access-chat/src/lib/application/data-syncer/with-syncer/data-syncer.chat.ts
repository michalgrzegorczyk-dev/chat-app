import { inject,Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MessageSend } from '../../../models/message-send.type';
import { NetworkService } from '../../../util-network/network.service';

@Injectable()
export class DataSyncer {
  private readonly queue$$ = new BehaviorSubject<MessageSend[]>([]);
  private readonly networkService = inject(NetworkService);

  addMessageToClientDb(message: MessageSend): void {
    if (!this.networkService.isOnline()) { // how to get if error in server
      this.queue$$.next([...this.queue$$.value, message]);
      console.log('CURRENT QUEUE', this.queue$$.value);
    }
  }
}

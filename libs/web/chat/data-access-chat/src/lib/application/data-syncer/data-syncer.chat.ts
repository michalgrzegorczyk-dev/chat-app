import { Injectable, inject } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { MessageSend } from '../../models/message-send.type';
import { NetworkService } from '../../util-network/network.service';

@Injectable()
export class DataSyncer {
  readonly sendMessage$ = new Subject<MessageSend>();
  private readonly queue$$ = new BehaviorSubject<MessageSend[]>([]);
  readonly queue$: Observable<MessageSend[]> = this.queue$$.asObservable();

  private readonly networkService = inject(NetworkService);

  addMessageToClientDb(message: MessageSend): void {
    if(!this.networkService.isOnline()) { // how to get if error in server
      this.queue$$.next([...this.queue$$.value, message]);
      console.log(this.queue$$.value);
    }
  }
}

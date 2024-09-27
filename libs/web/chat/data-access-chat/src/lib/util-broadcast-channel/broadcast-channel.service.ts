import { Injectable, NgZone, OnDestroy, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BroadcastMessage } from './broadcast-message.type';

@Injectable()
export class BroadcastChannelService implements OnDestroy {
  private readonly channel = new BroadcastChannel('broadcast');
  private readonly ngZone = inject(NgZone);
  private readonly messageSubject$$ = new Subject<BroadcastMessage>();

  constructor() {
    this.init();
  }

  ngOnDestroy(): void {
    this.close();
  }

  init(): void {
    this.channel.onmessage = (event) => {
      this.ngZone.run(() => {
        this.messageSubject$$.next(event.data);
      });
    };
  }

  postMessage(message: BroadcastMessage): void {
    this.channel.postMessage(message);
  }

  onMessage(): Observable<BroadcastMessage> {
    return this.messageSubject$$.asObservable();
  }

  close(): void {
    this.channel.close();
  }
}

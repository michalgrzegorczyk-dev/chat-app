import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface BroadcastMessage {
  type: string;
  payload: any;
}

@Injectable({
  providedIn: 'root'
})
export class BroadcastChannelService {
  private channel: BroadcastChannel;
  private messageSubject = new Subject<BroadcastMessage>();

  constructor(private ngZone: NgZone) {
    this.channel = new BroadcastChannel('chat_sync');
    this.channel.onmessage = (event) => {
      this.ngZone.run(() => {
        this.messageSubject.next(event.data);
      });
    };
  }

  public postMessage(message: BroadcastMessage): void {
    this.channel.postMessage(message);
  }

  public onMessage(): Observable<BroadcastMessage> {
    return this.messageSubject.asObservable();
  }

  public close(): void {
    this.channel.close();
  }
}

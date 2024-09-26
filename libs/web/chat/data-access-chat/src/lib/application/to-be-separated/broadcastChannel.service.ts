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

  /**
   * Send a message through the broadcast channel
   * @param message The message to be sent
   */
  public postMessage(message: BroadcastMessage): void {
    this.channel.postMessage(message);
  }

  /**
   * Listen for messages from the broadcast channel
   * @returns An Observable that emits received messages
   */
  public onMessage(): Observable<BroadcastMessage> {
    return this.messageSubject.asObservable();
  }

  /**
   * Close the broadcast channel
   */
  public close(): void {
    this.channel.close();
  }
}

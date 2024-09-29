import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, fromEvent } from 'rxjs';
import { NotifierService } from '@chat-app/ui-notifier';

@Injectable()
export class NetworkService {
  private readonly onlineStatusSubject$$ = new BehaviorSubject<boolean>(navigator.onLine);
  private readonly notifier = inject(NotifierService);

  constructor() {
    this.initializeNetworkListeners();
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  private initializeNetworkListeners(): void {
    fromEvent(window, 'online').subscribe(() => {
      this.notifier.notify('success','You are online');
      this.updateOnlineStatus(true);
    });
    fromEvent(window, 'offline').subscribe(() => {
      this.notifier.notify('error','You are offline');
      this.updateOnlineStatus(false);
    });
  }

  private updateOnlineStatus(isOnline: boolean): void {
    this.onlineStatusSubject$$.next(isOnline);
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';

@Injectable()
export class NetworkService {
  private readonly onlineStatusSubject$$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    this.initializeNetworkListeners();
  }

  getOnlineStatus(): Observable<boolean> {
    return this.onlineStatusSubject$$.asObservable();
  }

  isOnline(): boolean {
    return navigator.onLine;
  }

  private initializeNetworkListeners(): void {
    fromEvent(window, 'online').subscribe(() => this.updateOnlineStatus(true));
    fromEvent(window, 'offline').subscribe(() => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(isOnline: boolean): void {
    this.onlineStatusSubject$$.next(isOnline);
  }
}

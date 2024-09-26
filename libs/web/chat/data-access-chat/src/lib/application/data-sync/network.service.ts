import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private onlineStatusSubject = new BehaviorSubject<boolean>(navigator.onLine);

  constructor() {
    this.initializeNetworkListeners();
  }

  private initializeNetworkListeners(): void {
    fromEvent(window, 'online').subscribe(() => this.updateOnlineStatus(true));
    fromEvent(window, 'offline').subscribe(() => this.updateOnlineStatus(false));
  }

  private updateOnlineStatus(isOnline: boolean): void {
    console.log(`Network status changed. Online: ${isOnline}`);
    this.onlineStatusSubject.next(isOnline);
  }

  public getOnlineStatus(): Observable<boolean> {
    return this.onlineStatusSubject.asObservable();
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }
}

import { Injectable, NgZone } from '@angular/core';
import { Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PageVisibilityService {
  private pageVisibleSubject = new BehaviorSubject<boolean>(!document.hidden);
  private visibilityChange$: Observable<boolean>;

  constructor(private ngZone: NgZone) {
    this.visibilityChange$ = fromEvent(document, 'visibilitychange').pipe(
      map(() => !document.hidden),
      distinctUntilChanged(),
      shareReplay(1)
    );

    this.visibilityChange$.subscribe(isVisible => {
      this.ngZone.run(() => {
        this.pageVisibleSubject.next(isVisible);
      });
    });
  }

  /**
   * Returns an Observable that emits true when the page becomes visible
   * and false when it becomes hidden.
   */
  public onVisibilityChange(): Observable<boolean> {
    return this.pageVisibleSubject.asObservable();
  }

  /**
   * Returns an Observable that emits only when the page becomes visible.
   */
  public onPageVisible(): Observable<void> {
    return this.pageVisibleSubject.pipe(
      distinctUntilChanged(),
      filter(isVisible => isVisible),
      map(() => undefined)
    );
  }

  /**
   * Returns the current visibility state of the page.
   */
  public isPageVisible(): boolean {
    return !document.hidden;
  }
}

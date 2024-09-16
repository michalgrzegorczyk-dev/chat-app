import {Directive, ElementRef, AfterViewInit, NgZone, inject, OnInit} from '@angular/core';

// masz tylko jedna dyrektywe, nie ma sensu tworzenia osobnego katalogu
@Directive({
  selector: '[libScrollToBottom]',
  standalone: true,
})
export class ScrollToBottomDirective implements OnInit, AfterViewInit {
  private readonly el = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      new MutationObserver(() => this.scrollToBottom())
        .observe(this.el.nativeElement, {childList: true, subtree: true});
    });
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }
}

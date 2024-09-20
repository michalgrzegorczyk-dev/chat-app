import {
  Component,
  ViewChild,
  ViewContainerRef,
  Type,
  ComponentRef,
  AfterViewInit,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ButtonComponent } from '@chat-app/ui-button';

@Component({
  selector: 'mg-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('contentContainer', {read: ViewContainerRef, static: false}) contentViewContainer!: ViewContainerRef;
  readonly isOpen = signal(false);
  readonly title = signal('title');

  private contentComponentRef: ComponentRef<any> | null = null;
  private pendingContentComponent: Type<any> | null = null;

  ngAfterViewInit(): void {
    if (this.pendingContentComponent) {
      this.createContent(this.pendingContentComponent);
      this.pendingContentComponent = null;
    }
  }

  createContent<T>(contentComponent: Type<T>): ComponentRef<T> | null {
    if (!this.contentViewContainer) {
      this.pendingContentComponent = contentComponent;
      return null;
    }

    this.contentViewContainer.clear();
    this.contentComponentRef = this.contentViewContainer.createComponent(contentComponent);
    return this.contentComponentRef;
  }

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);

    if (this.contentComponentRef) {
      this.contentComponentRef.destroy();
      this.contentComponentRef = null;
    }
  }

  setTitle(title: string): void {
    this.title.set(title);
  }
}

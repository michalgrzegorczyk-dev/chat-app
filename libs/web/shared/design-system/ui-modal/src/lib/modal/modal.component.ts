import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  signal,
  Type,
  ViewChild,
  ViewContainerRef} from '@angular/core';
import { ButtonComponent } from '@chat-app/ui-button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ModalContentComponent {
  // Add any common properties or methods that all modal content components should have
}

@Component({
  selector: 'mg-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('contentContainer', { read: ViewContainerRef, static: false }) contentViewContainer!: ViewContainerRef;
  readonly isOpen = signal(false);
  readonly title = signal('title');

  private contentComponentRef: ComponentRef<ModalContentComponent> | null = null;
  private pendingContentComponent: Type<ModalContentComponent> | null = null;

  ngAfterViewInit(): void {
    if (this.pendingContentComponent) {
      this.createContent(this.pendingContentComponent);
      this.pendingContentComponent = null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createContent<T extends ModalContentComponent>(contentComponent: Type<ModalContentComponent>): ComponentRef<ModalContentComponent> | null {
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

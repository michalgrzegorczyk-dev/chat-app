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
// nie powinienes robic importow relatywnych
// to jest import na tym samym poziomie (ui)
// design system powinien byc jedna duza libka (ewentualnie w przypadku duzych design systemow mozna to podzielic dodatkowo na core)
// zobacz sobie jak to robi angular material czy mui
// jezeli design system bedzie jedna libka to bedziesz mogl robic importy relatywne
// dodatkowo unikniesz posiadania pieryliona libek (dla kazdego komponentu) co powoduje problemy w wiekszych projektach (eslint dlugo sie wykonuje)
import { ButtonComponent } from '../../../../ui-button/src/lib/button/button.component';

@Component({
  selector: 'lib-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent implements AfterViewInit {
  @ViewChild('contentContainer', {read: ViewContainerRef, static: false}) contentViewContainer!: ViewContainerRef;
  readonly isOpen = signal(false);
  readonly title = signal('title');

  // nie uzywaj any
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

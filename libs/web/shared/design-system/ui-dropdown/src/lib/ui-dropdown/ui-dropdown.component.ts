import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  // TODO based on rule prefix should be lib here
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mg-ui-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiDropdownComponent {
  readonly buttonText = input('Options');
  readonly items = input.required<{ type: 'link' | 'button', text: string, href?: string }[]>();
  readonly itemClick = output();

  isOpen = false;

  constructor(private elementRef: ElementRef) {
  }

  //todo not optimal? :)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }


  onItemClick(item: any) {
    this.itemClick.emit(item);
    this.isOpen = false;
  }
}

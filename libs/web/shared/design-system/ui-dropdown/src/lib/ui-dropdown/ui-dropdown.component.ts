import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy,Component, ElementRef,EventEmitter, HostListener, Input, Output } from '@angular/core';
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
  @Input() buttonText = 'Options';
  @Input() items: Array<{ type: 'link' | 'button', text: string, href?: string }> = [];
  @Output() readonly itemClick = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) {
  }

  isOpen = false;


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

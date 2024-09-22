import { Component, EventEmitter, Input, Output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'mg-ui-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ui-dropdown.component.html',
  styleUrl: './ui-dropdown.component.scss',
})
export class UiDropdownComponent {
  @Input() buttonText: string = 'Options';
  @Input() items: Array<{ type: 'link' | 'button', text: string, href?: string }> = [];
  @Output() itemClick = new EventEmitter<any>();

  constructor(private elementRef: ElementRef) {
  }

  isOpen = false;


  //todo not optimal? :)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    console.log('clickl');
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

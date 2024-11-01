import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output } from "@angular/core";
import { RouterLink } from "@angular/router";

type Link = {
  readonly type: "link";
  readonly text: string;
  readonly href: string;
};

type Button = {
  readonly type: "button";
  readonly text: string;
};

export type DropDownOption = Link | Button;

@Component({
  // TODO based on rule prefix should be lib here
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "mg-ui-dropdown",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./ui-dropdown.component.html",
  styleUrl: "./ui-dropdown.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiDropdownComponent {
  readonly buttonText = input("Options");
  readonly value = input("");
  readonly items = input.required<DropDownOption[]>();
  readonly itemClick = output();

  private elementRef = inject(ElementRef);

  isOpen = false;

  //todo not optimal? :)
  @HostListener("document:click", ["$event"])
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

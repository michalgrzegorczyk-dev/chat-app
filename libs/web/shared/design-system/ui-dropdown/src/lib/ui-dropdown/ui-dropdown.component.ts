import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from "@angular/core";
import { CONTROL_COMMON_IMPORTS, CONTROL_VIEW_PROVIDERS, ControlBase } from "../../../../control-base.directive";
import { RouterLink } from "@angular/router";

type Link = {
  readonly type: "link";
  readonly text: string;
  readonly href: string;
}

type Button = {
  readonly type: "button";
  readonly text: string;
}

export type DropDownOption = (Link | Button);

@Component({
  // TODO based on rule prefix should be lib here
  selector: "mg-dropdown",
  standalone: true,
  imports: [CommonModule, RouterLink, ...CONTROL_COMMON_IMPORTS],
  templateUrl: "./ui-dropdown.component.html",
  styleUrl: "./ui-dropdown.component.scss",
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  viewProviders: [...CONTROL_VIEW_PROVIDERS],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent extends ControlBase<unknown> {
  private readonly elementRef = inject(ElementRef);

  readonly label = input<string>();
  readonly buttonText = input<string>("Options");
  readonly items = input.required<DropDownOption[]>();
  get selectLabel () {
    const controlValue = this.control()?.value;
    const val = this.value();
    const def = this.buttonText();
    const value = controlValue || val || def;
    return value;
  };

  isOpen = false;

  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  itemSelect(item: DropDownOption) {
    if (item.type !== "link") {
      this.control()?.setValue(item.text);
    }
    this.valueChange.emit(item);
    this.isOpen = false;
  }
}

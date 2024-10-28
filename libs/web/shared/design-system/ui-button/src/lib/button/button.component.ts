import { NgClass, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

@Component({
  selector: "mg-button",
  standalone: true,
  imports: [NgClass, NgIf],
  host: {
    class: "block",
  },
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      (click)="handleClick($event)"
      class="bg-primary-500 shadow-primary-500/30 hover:bg-primary-600 hover:shadow-primary-600/30 focus:ring-primary-500 relative w-full rounded-lg px-4
             py-3 text-sm font-medium text-white shadow-lg
             transition-all duration-150 ease-in-out focus:outline-none
             focus:ring-2 focus:ring-offset-2"
    >
      <span class="flex items-center justify-center space-x-2">
        <span>{{ text() }}</span>
        <ng-content select="[icon]" />
      </span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  text = input("");
  type = input<"button" | "submit" | "reset">("button");
  disabled = input(false);
  click = output<void>();

  handleClick(event: MouseEvent): void {
    if (this.disabled()) return;
    event.stopPropagation();
    this.click.emit();
  }
}

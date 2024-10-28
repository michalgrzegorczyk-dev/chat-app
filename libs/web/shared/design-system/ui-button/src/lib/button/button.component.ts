import { NgClass, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";


const BUTTON_SECONDARY_CLASS = [
  'focus:ring-primary-500',
  'flex',
  'w-full',
  'justify-center',
  'rounded-md',
  'border',
  'border-gray-300',
  'bg-white',
  'px-4',
  'py-3',
  'text-sm',
  'font-medium',
  'text-gray-700',
  'shadow-sm',
  'transition-colors',
  'duration-200',
  'hover:bg-gray-50',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2'
].join(' ');

const BUTTON_PRIMARY_CLASS = [
  'bg-primary-500',
  'shadow-primary-500/30',
  'hover:bg-primary-600',
  'hover:shadow-primary-600/30',
  'focus:ring-primary-500',
  'relative',
  'w-full',
  'rounded-lg',
  'px-4',
  'py-3',
  'text-sm',
  'font-medium',
  'text-white',
  'shadow-lg',
  'transition-all',
  'duration-150',
  'ease-in-out',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-offset-2'
].join(' ');

export type ButtonStyle = "primary" | "secondary";

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
      [class]="buttonClassesMap.get(variant())"
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
  variant = input<ButtonStyle>("primary");

  readonly buttonClassesMap = new Map<ButtonStyle, string>([
    ["primary", BUTTON_PRIMARY_CLASS],
    ["secondary", BUTTON_SECONDARY_CLASS],
  ])

  handleClick(event: MouseEvent): void {
    if (this.disabled()) return;
    event.stopPropagation();
    this.click.emit();
  }
}

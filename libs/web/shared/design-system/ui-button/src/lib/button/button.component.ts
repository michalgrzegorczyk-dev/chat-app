import { NgClass, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, HostBinding, input, output } from "@angular/core";

type ButtonVariant = "primary" | "secondary" | "outlined";
type ButtonSize = "sm" | "md" | "lg";

const BASE_CLASSES =
  "relative flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" as const;

const VARIANT_CLASSES = {
  primary: "bg-primary-500 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-600 hover:shadow-primary-600/30 focus:ring-primary-500",
  secondary: "bg-gray-500 text-white shadow-lg shadow-gray-500/30 hover:bg-gray-600 hover:shadow-gray-600/30 focus:ring-gray-500",
  outlined: "border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500 shadow-sm",
} as const;

const SIZE_CLASSES = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3",
  lg: "px-6 py-4 text-base",
} as const;

@Component({
  selector: "mg-button",
  standalone: true,
  host: {
    class: "block",
  },
  template: `
    <button (click)="handleClick($event)" [attr.aria-busy]="loading()" [class]="computedClasses()" [disabled]="disabled()" [type]="type()">
      <span class="flex items-center justify-center space-x-2">
        @if (loading()) {
        <svg class="-ml-1 mr-2 h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        }
        <span>
          <ng-content />
          {{ text() }}
        </span>
        <ng-content select="[icon]" />
      </span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgIf],
})
export class ButtonComponent {
  @HostBinding("class") hostClasses = computed(() => this.userClass());

  text = input("");
  variant = input<ButtonVariant>("primary");
  size = input<ButtonSize>("md");
  fullWidth = input<boolean>(true);
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  type = input<"button" | "submit" | "reset">("button");
  userClass = input<string>("");
  readonly click = output<void>();

  computedClasses = computed(() => {
    return [BASE_CLASSES, VARIANT_CLASSES[this.variant()], SIZE_CLASSES[this.size()], this.fullWidth() ? "w-full" : "w-auto"].join(" ");
  });

  handleClick(event: MouseEvent): void {
    if (this.loading() || this.disabled()) {
      return;
    }
    event.stopPropagation();
    this.click.emit();
  }
}

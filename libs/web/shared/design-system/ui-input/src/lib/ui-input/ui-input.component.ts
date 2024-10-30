import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, contentChild, ElementRef, input, model } from "@angular/core";
import { FormsModule } from "@angular/forms";

const INPUT_CLASSES = [
  "block",
  "w-full",
  "rounded-lg",
  "border",
  "border-gray-300",
  "bg-gray-50",
  "py-2.5",
  "pr-4",
  "text-sm",
  "text-gray-700",
  "placeholder-gray-400",
  "transition",
  "duration-150",
  "ease-in-out",
  "focus:outline-none",
  "focus:ring-2",
  "focus:border-primary-500",
  "focus:ring-primary-500/20",
].join(" ");

const LEFT_ICON_PADDING = "pl-10";
const DEFAULT_PADDING_LEFT = "pl-4";

@Component({
  selector: "mg-input",
  standalone: true,
  imports: [FormsModule, NgIf],
  host: {
    class: "block",
  },
  template: `
    <div class="space-y-2">
      @if (label()) {
      <label [for]="id()" class="block text-sm font-medium text-gray-700">
        {{ label() }}
      </label>
      }

      <div class="group relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <ng-content select="svg" />
        </div>

        <input
          [id]="id()"
          [name]="name()"
          [type]="type()"
          [required]="required()"
          [placeholder]="placeholder()"
          [ngModel]="value()"
          (ngModelChange)="value.set($event)"
          [class]="inputClasses()"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  readonly id = input("");
  readonly name = input("");
  readonly label = input("");
  readonly type = input<"text" | "email" | "password">("text");
  readonly placeholder = input("");
  readonly required = input(false);
  readonly value = model("");

  private leadingIcon = contentChild<ElementRef | null>("leadingIcon");

  inputClasses = computed(() => {
    const withIcon = this.leadingIcon();
    if (withIcon) {
      return [INPUT_CLASSES, LEFT_ICON_PADDING].join(" ");
    }
    return [INPUT_CLASSES, DEFAULT_PADDING_LEFT].join(" ");
  })
}

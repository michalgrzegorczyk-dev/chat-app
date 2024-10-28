import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { FormsModule } from "@angular/forms";

const INPUT_CLASSES = [
  "block",
  "w-full",
  "rounded-lg",
  "border",
  "border-gray-300",
  "bg-gray-50",
  "py-2.5",
  "pl-10",
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
          <ng-content select="[leadingIcon]" />
        </div>

        <input
          [id]="id()"
          [name]="name()"
          [type]="type()"
          [required]="required()"
          [placeholder]="placeholder()"
          [ngModel]="value()"
          (ngModelChange)="value.set($event)"
          [class]="INPUT_CLASSES"
        />
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  protected readonly INPUT_CLASSES = INPUT_CLASSES;

  readonly id = input("");
  readonly name = input("");
  readonly label = input("");
  readonly type = input<"text" | "email" | "password">("text");
  readonly placeholder = input("");
  readonly required = input(false);
  readonly value = model("");
}

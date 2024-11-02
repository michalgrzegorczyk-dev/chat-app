import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, contentChild, ElementRef, input } from "@angular/core";
import { CONTROL_COMMON_IMPORTS, CONTROL_VIEW_PROVIDERS, ControlBase } from "../../../../control-base.directive";

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

export type inputControlTypes = "text" | "email" | "password";

@Component({
  selector: "mg-input",
  standalone: true,
  imports: [...CONTROL_COMMON_IMPORTS],
  host: {
    class: "block",
  },
  templateUrl: "./ui-input.component.html",
  viewProviders: [...CONTROL_VIEW_PROVIDERS],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent extends ControlBase<unknown> {
  readonly name = input.required<string>();
  readonly label = input<string>();
  readonly type = input<inputControlTypes>("text");
  readonly placeholder = input();

  private leadingIcon = contentChild<ElementRef | null>("leadingIcon");

  inputClasses = computed(() => {
    const withIcon = this.leadingIcon();
    if (withIcon) {
      return [INPUT_CLASSES, LEFT_ICON_PADDING].join(" ");
    }
    return [INPUT_CLASSES, DEFAULT_PADDING_LEFT].join(" ");
  });
}

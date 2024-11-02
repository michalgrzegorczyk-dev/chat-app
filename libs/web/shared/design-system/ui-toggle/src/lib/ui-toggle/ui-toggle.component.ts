import { ChangeDetectionStrategy, Component } from "@angular/core";

import { CONTROL_COMMON_IMPORTS, CONTROL_VIEW_PROVIDERS, ControlBase } from "../../../../control-base.directive";

const TOGGLE_BASE_CLASSES = "peer h-6 w-11 rounded-full bg-gray-200";
const TOGGLE_FOCUS_CLASSES = "peer-focus:ring-primary-300 peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-primary-800";
const TOGGLE_CHECKED_CLASSES = "peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white";
const TOGGLE_THUMB_CLASSES =
  "after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']";
const TOGGLE_DARK_MODE_CLASSES = "dark:border-gray-600 dark:bg-gray-700";
const TOGGLE_CLASSES = [TOGGLE_BASE_CLASSES, TOGGLE_FOCUS_CLASSES, TOGGLE_CHECKED_CLASSES, TOGGLE_THUMB_CLASSES, TOGGLE_DARK_MODE_CLASSES].join(" ").trim();

// TODO: make component style customizablxe and/or inherited from theme
@Component({
  selector: "mg-toggle",
  standalone: true,
  imports: [...CONTROL_COMMON_IMPORTS],
  templateUrl: "./ui-toggle.component.html",
  viewProviders: [...CONTROL_VIEW_PROVIDERS],
  host: {
    class: "relative inline-block w-14 select-none",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent extends ControlBase<boolean> {
  readonly toggleTrackClasses = TOGGLE_CLASSES;
}

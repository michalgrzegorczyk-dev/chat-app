import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";

@Component({
  selector: "mg-button",
  standalone: true,
  template: `
    <button
      (click)="this.click.emit(); $event.stopPropagation()"
      [ngClass]="{
        'bg-primary-500 hover:bg-primary-600 text-white': !outlined(),
        'border-primary-500 text-primary-500 hover:bg-primary-100 border':
          outlined()
      }"
      class="focus:ring-primary-200 flex w-full items-center justify-center rounded-md
                   p-2 text-sm font-medium
                   shadow-sm transition duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50"
    >
      <ng-content />
      {{ buttonText() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class ButtonComponent {
  buttonText = input("");
  outlined = input(false);

  readonly click = output<void>();
}

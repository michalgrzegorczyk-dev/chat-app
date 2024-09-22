import {Component, input, output, ChangeDetectionStrategy} from "@angular/core";
import { NgClass } from '@angular/common';

@Component({
  selector: 'mg-button',
  standalone: true,
  template: `
    <button (click)="this.click.emit(); $event.stopPropagation()"
            [ngClass]="{
              'bg-primary-500 text-white hover:bg-primary-600': !outlined(),
              'border-primary-500 text-primary-500 border hover:bg-primary-100': outlined()
            }"
            class="w-full p-2 text-sm font-medium rounded-md focus:outline-none
                   focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50
                   flex items-center justify-center transition duration-300 shadow-sm">
      <ng-content />
      {{ buttonText() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass
  ]
})
export class ButtonComponent {
  buttonText = input('');
  outlined = input(false);

  click = output<void>();
}

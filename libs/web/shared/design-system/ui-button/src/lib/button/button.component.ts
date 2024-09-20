import {Component, input, output, ChangeDetectionStrategy} from "@angular/core";

@Component({
  selector: 'mg-button',
  standalone: true,
  template: `
    <button (click)="this.click.emit()"
            class="w-full p-2 bg-primary-500 text-white text-sm font-medium rounded-md hover:bg-primary-600
            focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 flex items-center
            justify-center transition duration-300 shadow-sm">
      <ng-content/>
      {{ buttonText() }}
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  buttonText = input('Add');
  click = output<void>();
}

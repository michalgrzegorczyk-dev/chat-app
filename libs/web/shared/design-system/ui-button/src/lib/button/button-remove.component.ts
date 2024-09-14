import {Component, output, ChangeDetectionStrategy} from "@angular/core";

@Component({
  selector: 'app-button-remove',
  standalone: true,
  template: `
    <button (click)="this.click.emit(); $event.stopPropagation()"
            class="w-8 h-8 bg-danger-200 text-white rounded-md hover:bg-danger-300 focus:outline-none focus:ring-2
            focus:ring-danger-100 focus:ring-opacity-50 flex items-center justify-center
            transition duration-300 shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonRemoveComponent {
  click = output<void>();
}

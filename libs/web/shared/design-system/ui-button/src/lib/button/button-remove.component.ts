import { ChangeDetectionStrategy, Component, output } from "@angular/core";

@Component({
  selector: "mg-button-remove",
  standalone: true,
  template: `
    <button
      (click)="this.click.emit(); $event.stopPropagation()"
      class="bg-danger-200 hover:bg-danger-300 focus:ring-danger-100 flex h-8 w-8 items-center justify-center
            rounded-md text-white shadow-sm transition duration-300
            focus:outline-none focus:ring-2 focus:ring-opacity-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="h-4 w-4"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonRemoveComponent {
  readonly click = output<void>();
}

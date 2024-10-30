import { ChangeDetectionStrategy, Component, computed, input, model, output } from "@angular/core";

// TODO: move ShadeScale type to a shared folder
type ShadeScale = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

export type ToggleTextConfig = {
  text: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  weight?: 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: 'gray' | 'red' | 'yellow' | 'green' | 'blue' | 'indigo' | 'purple' | 'pink';
  shade?: ShadeScale;
  shadeDark?: ShadeScale;
}

const DEFAULT_TEXT_CONFIG: Readonly<Pick<ToggleTextConfig, 'weight' | 'size' | 'color' | 'shade' | 'shadeDark'>> = {
  size: 'sm',
  weight: 'medium',
  color: 'gray',
  shade: '900',
  shadeDark: '300',
};

// TODO: make component functional with reactive form
@Component({
  selector: "mg-toggle",
  standalone: true,
  imports: [],
  template: `
    <label class="relative inline-flex cursor-pointer items-center">
      <input
        class="peer sr-only"
        id="theme-toggle"
        type="checkbox"
        [checked]="value()"
        role="switch"
        [attr.aria-checked]="value()"
        [attr.aria-label]="textConfig()?.text"
      />
      <div
        (click)="changeState()"
        [class]="toggleTrackClasses"
      ></div>
      @if (textConfig()) {
      <span [class]="textClasses()">{{ textConfig()?.text }}</span>
      }
    </label>
  `,
  host:{
    class: 'flex items-center justify-between'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
  value = model.required<boolean>();
  textConfig = input<ToggleTextConfig>();
  valueChange = output<boolean>();

  readonly toggleTrackClasses = `peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
      peer-checked:bg-primary-500 peer h-6 w-11 rounded-full bg-gray-200
      after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5
      after:rounded-full after:border after:border-gray-300 after:bg-white
      after:transition-all after:content-[''] peer-checked:after:translate-x-full
      peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4
      dark:border-gray-600 dark:bg-gray-700`.trim();

  textClasses = computed(() => {
    const {
      size = DEFAULT_TEXT_CONFIG.size,
      weight = DEFAULT_TEXT_CONFIG.weight,
      color = DEFAULT_TEXT_CONFIG.color,
      shade = DEFAULT_TEXT_CONFIG.shade,
      shadeDark = DEFAULT_TEXT_CONFIG.shadeDark,
    } = this.textConfig() || {};
    return `ml-3 text-${size} font-${weight} text-${color}-${shade} dark:text-${color}-${shadeDark}`;
  });

  changeState(): void {
    this.value.update((value) => !value);
    this.valueChange.emit(this.value());
  }
}

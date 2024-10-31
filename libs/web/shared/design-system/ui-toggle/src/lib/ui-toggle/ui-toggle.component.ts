import { ChangeDetectionStrategy, Component, inject, input, model, OnDestroy, OnInit, output } from "@angular/core";
import { AbstractControl, ControlContainer, FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

// TODO: make component style customizable and/or inherited from theme
@Component({
  selector: "mg-toggle",
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <label class="relative inline-flex cursor-pointer items-center">
      @if (parentControlContainer) {
        <input
          [formControlName]="controlName()"
          [checked]="value()"
          [attr.id]="id()"
          [attr.aria-checked]="value()"
          type="checkbox"
          class="peer sr-only"
          role="switch"
        />
      } @else {
        <input
          [checked]="value()"
          [attr.id]="id()"
          [attr.aria-checked]="value()"
          type="checkbox"
          class="peer sr-only"
          role="switch"
        />
      }
      <div (click)="changeState()" [class]="toggleTrackClasses"></div>
    </label>
  `,
  host: {
    class: "flex items-center justify-between",
  },
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent implements OnInit, OnDestroy {
  private readonly controlNameFallback = "unknown";

  id = input.required<string>();
  value = model<boolean>(false);
  valueChange = output<boolean>();

  readonly toggleTrackClasses = `peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800
      peer-checked:bg-primary-500 peer h-6 w-11 rounded-full bg-gray-200
      after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5
      after:rounded-full after:border after:border-gray-300 after:bg-white
      after:transition-all after:content-[''] peer-checked:after:translate-x-full
      peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4
      dark:border-gray-600 dark:bg-gray-700`.trim();

  // TODO: Validate reactive from inptus
  // Reactive form options
  parentControlContainer = inject(ControlContainer, { skipSelf: true, optional: true });
  formControl = model<AbstractControl>(new FormControl<boolean>(this.value()));
  controlName = input<string>(this.controlNameFallback);

  ngOnInit(): void {
    this.injectControl();
  }

  ngOnDestroy(): void {
    this.destroyControl();
  }

  changeState(): void {
    this.value.update((value) => !value);
    this.valueChange.emit(this.value());
  }

  // TODO: move AbstractControl functions to separate class
  // Reactive form fns
  private shouldInitializeReactiveControl(): boolean {
    return !!this.parentControlContainer && !!this.controlName();
  }

  protected injectControl() {
    if (!this.shouldInitializeReactiveControl()) return;

    const control = this.parentControlContainer!.control;
    const name = this.controlName() || this.controlNameFallback;

    if (control instanceof FormGroup) {
      control.addControl(name, this.formControl());
    } else if (control instanceof FormArray) {
      control.push(this.formControl());
    }
  }

  private destroyControl() {
    if (!this.shouldInitializeReactiveControl()) return;

    const control = this.parentControlContainer!.control;

    if (control instanceof FormGroup) {
      control.removeControl(this.controlName() || this.controlNameFallback);
    } else if (control instanceof FormArray) {
      const index = control.controls.indexOf(this.formControl()!);
      control.removeAt(index);
    }
  }
}

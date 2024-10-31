import { ChangeDetectionStrategy, Component, inject, input, model, OnDestroy, OnInit, output } from "@angular/core";
import { ControlContainer, FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

const TOGGLE_BASE_CLASSES = 'peer h-6 w-11 rounded-full bg-gray-200';
const TOGGLE_FOCUS_CLASSES = 'peer-focus:ring-primary-300 peer-focus:outline-none peer-focus:ring-4 dark:peer-focus:ring-primary-800';
const TOGGLE_CHECKED_CLASSES = 'peer-checked:bg-primary-500 peer-checked:after:translate-x-full peer-checked:after:border-white';
const TOGGLE_THUMB_CLASSES = 'after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[\'\']';
const TOGGLE_DARK_MODE_CLASSES = 'dark:border-gray-600 dark:bg-gray-700';

const TOGGLE_CLASSES = [
  TOGGLE_BASE_CLASSES,
  TOGGLE_FOCUS_CLASSES,
  TOGGLE_CHECKED_CLASSES,
  TOGGLE_THUMB_CLASSES,
  TOGGLE_DARK_MODE_CLASSES
].join(' ').trim();

const HOST_CLASSES = "flex items-center justify-between";

// TODO: make component style customizablxe and/or inherited from theme
@Component({
  selector: "mg-toggle",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./ui-toggle.component.html",
  host: {
    '[class]': 'hostClasses()',
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
  readonly toggleTrackClasses = TOGGLE_CLASSES;
  readonly hostClasses = input<string>(HOST_CLASSES);
  readonly parentControlContainer = inject(ControlContainer, { skipSelf: true, optional: true });

  readonly id = input.required<string>();
  readonly value = model<boolean>(false);

  readonly formControl = input<FormControl<boolean>>(new FormControl<boolean>(false, { nonNullable: true }));
  readonly controlName = input<string>(this.controlNameFallback);

  readonly valueChange = output<boolean>();

  ngOnInit(): void {
    this.injectControl();
  }

  ngOnDestroy(): void {
    this.destroyControl();
  }

  changeValue(): void {
    this.value.update((value) => !value);
    this.formControl().setValue(this.value());
    this.valueChange.emit(this.value());
  }

  // TODO: move AbstractControl functions to separate class
  // TODO: add Validators to control
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

import { Directive, inject, input, model, OnDestroy, OnInit, output } from "@angular/core";
import { AbstractControl, ControlContainer, FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

export const CONTROL_VIEW_PROVIDERS = [
  {
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, {skipSelf: true}),
  }
] as const;

export const CONTROL_COMMON_IMPORTS = [
  ReactiveFormsModule,
] as const;

/**
 * If controlName is provided the control will be added to the parent ControlContainer.
 * If control is provided the control will be used instead of creating a new one, and will not be injected in ControlContainer.
 */
@Directive()
export abstract class ControlBase<ControlType> implements OnInit, OnDestroy {
  readonly parentControlContainer = inject(ControlContainer, { skipSelf: true, optional: true });

  /**
  * @required
  */
  readonly id = input.required<string>();

  /**
  * @optional Define FormControl object.
  * Can be used inside ControlContainer or directly.
  */
  readonly control = model<FormControl<ControlType | null>>();

  /**
   * @optional Name for control injection into ControlContainer.
   * If provided, a new control will be created and injected in closest ControlContainer.
   * Key collision will ends in control overwrite in ControlContainer (FromGroups).
  */
  readonly controlName = input<string>();

  /**
  * @optional Value for control when providing controlName.
  * @default null
  */
  readonly value = input<ControlType | null>(null);

  /**
   * @readonly Output signal, react to value changes.
   */
  readonly valueChange = output<ControlType | null>();

  ngOnInit(): void {
    this.validateControlConfig(this.value(), this.controlName(), this.control());
    this.initControl();
    this.injectControl();
  }

  ngOnDestroy(): void {
    this.destroyControl();
  }

  protected validateControlConfig(value?: ControlType | null, controlName?: string, control?: AbstractControl): void {
    const messagePrefix = `Control Component;`;
    const hasControl = !!control;
    const hasValue = (value !== null && value !== undefined);
    const hasControlName = !!controlName;

    if (!hasControlName && !hasControl) {
      throw new Error(`${messagePrefix} Missing properties to build AbstractControl. Provide "control" or "controlName".`);
    }
    if (hasControl && (hasControlName || hasValue)) {
      throw new Error(`${messagePrefix} "control" must not be used within with "value" or "controlName".`);
    }
  }

  /**
   * @protected
   * Creates control and initializes it
   */
  protected initControl(): void {
    if (!this.control()) {
      const value = this.value() || null;
      this.control.set(new FormControl<ControlType | null>(value, { nonNullable: true }));
    }
  }

  /**
   * @private
   * @returns Object with properties for control injection.
   */
  private getValidatedControlConfig() {
    const control = this.control();
    const controlName = this.controlName();
    const parentControl = this.parentControlContainer?.control;

    if (!control || !controlName || !parentControl) {
      return undefined;
    }

    return { control, controlName, parentControl };
}

  /**
   * @protected
   * Injects control into ControlContainer
   */
  protected injectControl(): void {
    const validatedConfig = this.getValidatedControlConfig();
    if (!validatedConfig) return;

    const { control, controlName, parentControl } = validatedConfig;

    if (parentControl instanceof FormGroup) {
      parentControl.addControl(controlName, control);
    } else if (parentControl instanceof FormArray) {
      parentControl.push(control);
    }
  }

  /**
   * @protected
   * Remove control from ControlContainer
   */
  protected destroyControl() {
    const validatedConfig = this.getValidatedControlConfig();
    if (!validatedConfig) return;

    const { control, controlName, parentControl } = validatedConfig;

    if (parentControl instanceof FormGroup) {
      parentControl.removeControl(controlName);
    } else if (parentControl instanceof FormArray) {
      const index = parentControl.controls.indexOf(control);
      if (index !== -1) {
        parentControl.removeAt(index);
      } else {
        console.warn(`Control Base: Control ${controlName} not found in ControlContainer.`);
      }
    }
  }
}

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from "@angular/core";
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import {
  AccountListComponent,
  AccountWidgetComponent,
} from "@chat-app/feature-account";
import { ButtonComponent } from "@chat-app/ui-button";
import { DropDownOption, DropdownComponent } from "@chat-app/ui-dropdown";
import { InputComponent } from "@chat-app/ui-input";
import { ToggleComponent } from "@chat-app/ui-toggle";

@Component({
  selector: "mg-account-layout",
  standalone: true,
  templateUrl: "./account.component.html",
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    AccountWidgetComponent,
    AccountListComponent,
    RouterOutlet,
    InputComponent,
    DropdownComponent,
    ButtonComponent,
    ToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

  fb = inject(NonNullableFormBuilder);

  account = signal({
    name: "David",
    language: 'English',
    darkTheme: false
  });

  languageOptions = signal<DropDownOption[]>([
    {
      type: "button",
      text: "English"
    },
    {
      type: "button",
      text: "Español"
    },
    {
      type: "button",
      text: "Français"
    },
    {
      type: "button",
      text: "Deutsch"
    },
    {
      type: "button",
      text: "日本語"
    }
  ]);

  formFields = {
    userName: 'userName',
    language: 'language',
    themeToggleControl: 'darkTheme'
  } as const;

  accountForm = this.fb.group({
    [this.formFields.userName]: [this.account().name, { updateOn: 'blur' }],
    [this.formFields.language]: [this.account().language, { updateOn: 'blur' }],
    [this.formFields.themeToggleControl]: [this.account().darkTheme]
  });

  get userNameControl () {
    return this.accountForm.get(this.formFields.userName) as FormControl;
  }

  get languageControl () {
    return this.accountForm.get(this.formFields.language) as FormControl;
  }

  get darkThemeControl () {
    return this.accountForm.get(this.formFields.themeToggleControl) as FormControl;
  }
  darkTheme = signal(false);

  submit() {
    console.log(this.accountForm.value);
  }

  back() {
    history.back();
  }
}

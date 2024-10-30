import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import {
  AccountListComponent,
  AccountWidgetComponent,
} from "@chat-app/feature-account";
import { ButtonComponent } from "@chat-app/ui-button";
import { DropDownOption, UiDropdownComponent } from "@chat-app/ui-dropdown";
import { InputComponent } from "@chat-app/ui-input";

@Component({
  selector: "mg-account-layout",
  standalone: true,
  templateUrl: "./account.component.html",
  imports: [
    NgFor,
    NgIf,
    FormsModule,
    AccountWidgetComponent,
    AccountListComponent,
    RouterOutlet,
    InputComponent,
    UiDropdownComponent,
    ButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {

  account = signal({
    name: "David",
    language: 'English'
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

  back() {
    history.back();
  }
}

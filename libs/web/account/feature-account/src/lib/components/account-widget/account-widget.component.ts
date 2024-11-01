import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ButtonComponent } from "@chat-app/ui-button";
import { DropDownOption, UiDropdownComponent } from "@chat-app/ui-dropdown";
import { AuthService } from "@chat-app/web/shared/util/auth";

@Component({
  selector: "mg-account-widget",
  templateUrl: "./account-widget.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, ButtonComponent, UiDropdownComponent],
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
})
export class AccountWidgetComponent {
  dropdownItems: DropDownOption[] = [
    { type: "link", text: "Account Settings", href: "account" },
    { type: "link", text: "Sign Out", href: "auth" },
  ];
  readonly #authService = inject(AuthService);
  readonly account = inject(AuthService).user;

  async onItemClick($event: any): Promise<void> {
    if ($event.text === "Sign Out") {
      await this.#authService.logout();
    }
  }
}

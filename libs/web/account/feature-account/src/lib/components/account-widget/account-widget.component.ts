import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ButtonComponent } from "@chat-app/ui-button";
import { UiDropdownComponent } from "@chat-app/ui-dropdown";
import { AuthService } from "@chat-app/web/shared/util/auth";

@Component({
  selector: "mg-account-widget",
  templateUrl: "./account-widget.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, ButtonComponent, UiDropdownComponent],
})
export class AccountWidgetComponent {
  dropdownItems: any = [
    { type: "button", text: "Add Conversation" },
    { type: "link", text: "Account Settings", href: "account" },
    { type: "button", text: "Change Account", href: "auth" },
  ];
  readonly #authService = inject(AuthService);
  readonly account = inject(AuthService).user;

  async onItemClick($event: any): Promise<void> {
    if ($event.text === "Change Account") {
      await this.#authService.logout();
    }
  }
}

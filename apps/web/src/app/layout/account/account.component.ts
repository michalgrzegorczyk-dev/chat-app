import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterOutlet } from "@angular/router";
import {
  AccountListComponent,
  AccountWidgetComponent,
} from "@chat-app/feature-account";

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {
  back() {
    history.back();
  }
}

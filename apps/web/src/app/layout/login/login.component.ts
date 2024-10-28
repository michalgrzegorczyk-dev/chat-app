import { AsyncPipe, JsonPipe, NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AccountListComponent, AccountWidgetComponent } from "@chat-app/feature-account";
import { routes } from "@chat-app/util-routing";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { ButtonComponent } from "@chat-app/ui-button";
import { InputComponent } from "@chat-app/ui-input";

@Component({
  selector: "mg-login",
  standalone: true,
  templateUrl: "./login.component.html",
  imports: [NgFor, NgIf, FormsModule, AccountWidgetComponent, AccountListComponent, AsyncPipe, JsonPipe, ButtonComponent, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  username = "";
  password = "";
  error = "";
  users = [
    {
      id: "1",
      name: "David",
      email: "david@example.com",
      password: "davidpass123",
      profilePhotoUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Mackenzie&skinColor=ecad80,f2d3b1",
    },
    {
      id: "2",
      name: "Frank",
      email: "frank@example.com",
      password: "frankpass123",
      profilePhotoUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Liam&skinColor=ecad80,f2d3b1",
    },
    {
      id: "3",
      name: "Bob",
      email: "bob@example.com",
      password: "bobpass123",
      profilePhotoUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=Brian&skinColor=ecad80,f2d3b1",
    },
    {
      id: "4",
      name: "Gizmo",
      email: "gizmo@example.com",
      password: "gizmopass123",
      profilePhotoUrl: "https://api.dicebear.com/9.x/adventurer/svg?seed=George",
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedUser: any;
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  onSubmit(): void {
    this.error = "";
    this.#authService.login(this.username, this.password).subscribe(() => {
      this.#router.navigate([routes.chat.url()]);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fillCredentials(user: any) {
    this.username = user.email;
    this.password = user.password;
  }
}

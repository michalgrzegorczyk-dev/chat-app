import { AsyncPipe, JsonPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AccountListComponent, AccountWidgetComponent } from "@chat-app/feature-account";
import { routes } from "@chat-app/util-routing";
import { AuthService } from "@chat-app/web/shared/util/auth";
import { ButtonComponent } from "@chat-app/ui-button";
import { InputComponent } from "@chat-app/ui-input";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profilePhotoUrl: string;
}

@Component({
  selector: "mg-login",
  standalone: true,
  templateUrl: "./login.component.html",
  imports: [AccountWidgetComponent, AccountListComponent, AsyncPipe, JsonPipe, ButtonComponent, InputComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly fb = inject(NonNullableFormBuilder);
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  loginForm = this.fb.group({
    userName: ["", Validators.required],
    password: ["", Validators.required],
  });

  get userName () {
    return this.loginForm.get("userName") as FormControl;
  }

  get password () {
    return this.loginForm.get("password") as FormControl;
  }

  error = "";

  // TODO: move this to a separate file/service
  users: User[] = [
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

  onSubmit(): void {
    const { userName, password } = this.loginForm.value;
    if (userName && password) {
      this.error = "";

      this.#authService.login(userName, password).subscribe(() => {
        this.#router.navigate([routes.chat.url()]);
      });
    }

  }

  fillCredentials(user: User) {
    this.loginForm.setValue({ userName: user.email, password: user.password });
  }
}

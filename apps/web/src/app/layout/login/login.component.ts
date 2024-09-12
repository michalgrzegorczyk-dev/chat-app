import {Component, inject, ChangeDetectionStrategy, signal, OnInit, DestroyRef} from "@angular/core";
import {NgFor, NgIf, JsonPipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
// import {AuthService} from "../../shared/auth/utils-auth/auth.service";
// import {AccountList} from "../../account/ui-account-list/account-list";
// import {first} from "rxjs";
// import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
// import {ROUTES} from "../../app.routes";
// import {User} from "../../chat/domain/entities/user.type";

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [NgFor, NgIf, FormsModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  // readonly users = signal<User[]>([]);
  // private readonly router = inject(Router);
  // private readonly authService = inject(AuthService);
  // private readonly destroyRef = inject(DestroyRef);
  //
  ngOnInit(): void {
    // this.authService.getAllUsers().pipe(first(), takeUntilDestroyed(this.destroyRef)).subscribe((response: User[]) => {
    //   this.users.set(response);
    // });
  }

  // async onSelectUser(user: User): Promise<void> {
  //   this.authService.setUser(user);
  //   await this.router.navigate([`/${ROUTES.CHAT}`]);
  // }
}

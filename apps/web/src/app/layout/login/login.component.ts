import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountWidgetComponent, AccountListComponent } from '@chat-app/feature-account';
import { User } from '@chat-app/domain';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { Router } from '@angular/router';
import { routing } from '@chat-app/util-routing';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mg-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [NgFor, NgIf, FormsModule, AccountWidgetComponent, AccountListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  //todo check leaks with tosignal approach
  readonly users = toSignal(this.authService.getAllUsers(), { initialValue: [] });
  private readonly router = inject(Router);

  async onSelectUser(user: User): Promise<void> {
    this.authService.setUser(user);
    await this.router.navigate([`${routing.chat.url()}`]);
  }
}

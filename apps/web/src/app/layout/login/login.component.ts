import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgFor, NgIf, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountWidgetComponent, AccountListComponent } from '@chat-app/feature-account';
import { User } from '@chat-app/domain';
import { Router } from '@angular/router';
import { AuthService } from '@chat-app/util-auth';
import { ROUTES, routing } from '../../app.routes';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [NgFor, NgIf, FormsModule, JsonPipe, AccountWidgetComponent, AccountListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  //todo
  readonly users = toSignal(this.authService.getAllUsers(), { initialValue: []})
  private readonly router = inject(Router);

  async onSelectUser(user: User): Promise<void> {
    this.authService.setUser(user);
    await this.router.navigate([`${routing.chat.url()}`]);
  }
}

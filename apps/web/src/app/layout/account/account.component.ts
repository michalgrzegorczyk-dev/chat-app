import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountWidgetComponent, AccountListComponent } from '@chat-app/feature-account';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'mg-account-layout',
  standalone: true,
  templateUrl: './account.component.html',
  imports: [NgFor, NgIf, FormsModule, AccountWidgetComponent, AccountListComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  private readonly authService = inject(AuthService);
  //todo check leaks with tosignal approach
  readonly users = toSignal(this.authService.getAllUsers(), { initialValue: [] });
  private readonly router = inject(Router);

}

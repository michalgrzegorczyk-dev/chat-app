import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { ButtonComponent } from '@chat-app/ui-button';
import { Router } from '@angular/router';
import { routing } from '@chat-app/util-routing';

@Component({
  selector: 'mg-account-widget',
  templateUrl: './account-widget.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, ButtonComponent]
})
export class AccountWidgetComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly user = this.authService.user;

  async logOut(): Promise<void> {
    await this.authService.logOut();
  }

  async openSettings(): Promise<void> {
    await this.router.navigate([`${routing.account.url()}`]);
  }
}

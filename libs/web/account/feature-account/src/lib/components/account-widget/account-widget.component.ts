import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { AuthService } from '@chat-app/web/shared/util/auth';

@Component({
  selector: 'lib-account-widget',
  templateUrl: './account-widget.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class AccountWidgetComponent {
  readonly authService = inject(AuthService);
  readonly user = this.authService.user;

  async logOut(): Promise<void> {
    await this.authService.logOut();
  }
}

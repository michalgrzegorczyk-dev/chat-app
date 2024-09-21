import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountWidgetComponent, AccountListComponent } from '@chat-app/feature-account';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'mg-account-layout',
  standalone: true,
  templateUrl: './account.component.html',
  imports: [NgFor, NgIf, FormsModule, AccountWidgetComponent, AccountListComponent, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {

  back() {
    history.back();
  }
}

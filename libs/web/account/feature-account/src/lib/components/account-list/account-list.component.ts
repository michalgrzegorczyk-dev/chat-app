import {Component, ChangeDetectionStrategy, input, output} from "@angular/core";
import { User } from '@chat-app/domain';

@Component({
  selector: 'mg-account-list',
  templateUrl: './account-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent {
  readonly users = input<User[]>([]);
  readonly selectUserEvent = output<User>();

  selectUser(user: User): void {
    this.selectUserEvent.emit(user);
  }
}

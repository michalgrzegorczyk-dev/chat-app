import {Component, ChangeDetectionStrategy, input, output} from "@angular/core";
import {JsonPipe, NgClass} from "@angular/common";
import { User } from '@chat-app/domain';

@Component({
  selector: 'mg-account-list',
  templateUrl: './account-list.component.html',
  standalone: true,
  imports: [JsonPipe, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent {
  readonly users = input<User[]>([]);
  readonly selectUserEvent = output<User>();

  selectUser(user: User): void {
    this.selectUserEvent.emit(user);
  }
}

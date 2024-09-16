import {Component, ChangeDetectionStrategy, input, output} from "@angular/core";
import {JsonPipe, NgClass} from "@angular/common";
// to jest inna domena niz chat-app, tak?
// jak tak to te typy powinny byc osobne, tj domeny powinny byc niezalezne. User w chat-app moze byc czyms innym niz user w Account
import { User } from '@chat-app/domain';

@Component({
  selector: 'lib-account-list',
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

import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
// import { User } from '@chat-app/domain';
// TODO wait for auth to be implemented
@Component({
  selector: "mg-account-list",
  templateUrl: "./account-list.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountListComponent {
  // eslint-disable-next-line
  readonly users = input<any[]>([]);
  // eslint-disable-next-line
  readonly selectUserEvent = output<any>();

  selectUser(user: any): void {
    this.selectUserEvent.emit(user);
  }
}

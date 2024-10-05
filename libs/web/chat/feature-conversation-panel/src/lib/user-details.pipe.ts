import { inject, Pipe, PipeTransform } from '@angular/core';
import { ChatFacade } from '@chat-app/domain';
import { User } from '@chat-app/web/shared/util/auth';

type UserKeys = keyof User;

@Pipe({
  name: 'mgUserDetails',
  standalone: true
})
export class MgUserDetailsPipe implements PipeTransform {
  readonly #members = inject(ChatFacade).memberIdMap;

  transform(userId: string, detailKey: UserKeys): string {
    if (this.#members() && userId) {
      const result = this.#members().get(userId);
      if (result) {
        return result[detailKey] ?? '';
      }
    }
    return '';
  }
}

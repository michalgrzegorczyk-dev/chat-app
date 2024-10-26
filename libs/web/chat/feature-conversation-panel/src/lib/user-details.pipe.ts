import { Pipe, PipeTransform, inject } from '@angular/core';
import { User } from '@chat-app/web/shared/util/auth';
import { ChatStore } from '../../../data-access-chat/src/lib/application/store/chat.store';

type UserKeys = keyof User;

@Pipe({
  name: 'mgUserDetails',
  standalone: true
})
export class MgUserDetailsPipe implements PipeTransform {
  memberIdMap = inject(ChatStore).memberIdMap;

  transform(userId: string, detailKey: UserKeys): string {
    if (this.memberIdMap() && userId) {
      const result = this.memberIdMap().get(userId);
      if (result) {
        return result[detailKey] ?? '';
      }
    }
    return '';
  }
}

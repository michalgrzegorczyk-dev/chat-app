import {Pipe, inject, PipeTransform} from "@angular/core";
import { ChatStoreService, UserKeys } from '@chat-app/domain';

@Pipe({
  name: 'userDetail',
  standalone: true
})
export class UserDetailPipe implements PipeTransform {
  private readonly members = inject(ChatStoreService).memberList;

  transform(userId: string, detailKey: UserKeys): string {
    if (this.members() && userId) {
      const result = this.members().get(userId);
      if (result) {
        return result[detailKey] ?? '';
      }
    }
    return '';
  }
}

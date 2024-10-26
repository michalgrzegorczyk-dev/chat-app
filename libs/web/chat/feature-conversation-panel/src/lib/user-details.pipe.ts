import { inject, Pipe, PipeTransform } from "@angular/core";
import { ChatStore } from "@chat-app/domain";
import { User } from "@chat-app/web/shared/util/auth";

type UserKeys = keyof User;

@Pipe({
  name: "mgUserDetails",
  standalone: true,
})
export class MgUserDetailsPipe implements PipeTransform {
  readonly #memberIdMap = inject(ChatStore).memberIdMap;

  transform(userId: string, detailKey: UserKeys): string {
    if (this.#memberIdMap() && userId) {
      const result = this.#memberIdMap().get(userId);
      if (result) {
        return result[detailKey] ?? "";
      }
    }
    return "";
  }
}

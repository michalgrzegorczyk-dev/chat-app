import { DatePipe, JsonPipe, NgClass, NgForOf, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from "@angular/core";
import { ChatStore } from "@chat-app/domain";
import { AuthService } from "@chat-app/web/shared/util/auth";

import { ScrollToBottomDirective } from "../../scroll-bottom.directive";
import { MgUserDetailsPipe } from "../../user-details.pipe";
import { SingleMessageComponent } from "../single/single-message.component";

@Component({
  selector: "mg-message-list",
  templateUrl: "./message-list.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, NgClass, NgIf, MgUserDetailsPipe, DatePipe, SingleMessageComponent, ScrollToBottomDirective, JsonPipe],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow-y: auto;
      }
    `,
  ],
})
export class MessageListComponent {
  @ViewChild("messageContainer") messageContainer!: ElementRef;
  readonly account = inject(AuthService).user;
  readonly #store = inject(ChatStore);
  messageList = this.#store.messageList;
}

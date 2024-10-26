import { DatePipe, NgClass, NgForOf, NgIf, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { AuthService } from '@chat-app/web/shared/util/auth';

import { ScrollToBottomDirective } from '../../scroll-bottom.directive';
import { MgUserDetailsPipe } from '../../user-details.pipe';
import { SingleMessageComponent } from '../single/single-message.component';
import { ChatStore } from '../../../../../data-access-chat/src/lib/application/store/chat.store';

@Component({
  selector: 'mg-message-list',
  templateUrl: './message-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    MgUserDetailsPipe,
    DatePipe,
    SingleMessageComponent,
    ScrollToBottomDirective,
    JsonPipe
  ],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        overflow-y: auto;
      }
    `
  ]
})
export class MessageListComponent {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  readonly user = inject(AuthService).user;
  readonly #store = inject(ChatStore);
  messageList = this.#store.messageList;
}

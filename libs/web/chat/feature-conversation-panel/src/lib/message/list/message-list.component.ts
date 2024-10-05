import { DatePipe,NgClass, NgForOf, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { ChatFacade } from '@chat-app/domain';
import { AuthService } from '@chat-app/web/shared/util/auth';

import { ScrollToBottomDirective } from '../../scroll-bottom.directive';
import { UserDetailPipe } from '../../user-detail.pipe';
import { SingleMessageComponent } from '../single/single-message.component';

@Component({
  selector: 'mg-message-list',
  templateUrl: './message-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    UserDetailPipe,
    DatePipe,
    SingleMessageComponent,
    ScrollToBottomDirective,
  ],
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
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  readonly user = inject(AuthService).user;
  readonly #chatStore = inject(ChatFacade);
  readonly messages = this.#chatStore.messageList;
}

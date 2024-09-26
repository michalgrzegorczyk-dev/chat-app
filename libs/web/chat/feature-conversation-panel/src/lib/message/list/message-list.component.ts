import {
  Component,
  ChangeDetectionStrategy,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgForOf, NgClass, NgIf, DatePipe } from '@angular/common';
import { UserDetailPipe } from '../../user-detail.pipe';
import { SingleMessageComponent } from '../single/single-message.component';
import { ScrollToBottomDirective } from '../../scroll-bottom.directive';
import { AuthService } from '@chat-app/web/shared/util/auth';
import { ChatFeatureStore, ChatFacade } from '@chat-app/domain';

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
  readonly user = inject(AuthService).user;
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  private readonly chatStore = inject(ChatFacade);
  readonly messages = this.chatStore.messageList;
}

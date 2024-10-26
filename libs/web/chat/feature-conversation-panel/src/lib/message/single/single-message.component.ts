import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Message } from '@chat-app/domain';

import { MgUserDetailsPipe } from '../../user-details.pipe';

@Component({
  selector: 'mg-message',
  standalone: true,
  imports: [NgClass, DatePipe, MgUserDetailsPipe],
  templateUrl: './single-message.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SingleMessageComponent {
  message = input.required<Message>();
  currentUserId = input<string>();
}

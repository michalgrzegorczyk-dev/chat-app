import { NgClass } from '@angular/common';
import {ChangeDetectionStrategy,Component, Input} from '@angular/core';
import { Message } from '@chat-app/domain';

import {UserDetailPipe} from "../../user-detail.pipe";

@Component({
  selector: 'mg-message',
  standalone: true,
  imports: [NgClass, UserDetailPipe],
  templateUrl: './single-message.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleMessageComponent {
  @Input() message!: Message;
  @Input() currentUserId!: string;
}

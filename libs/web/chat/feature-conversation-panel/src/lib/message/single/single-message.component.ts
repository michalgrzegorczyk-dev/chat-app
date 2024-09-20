import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserDetailPipe} from "../../user-detail.pipe";
import { Message } from '@chat-app/domain';

@Component({
  selector: 'lib-message',
  standalone: true,
  imports: [CommonModule, UserDetailPipe],
  templateUrl: './single-message.component.html',
  styles: [
    `
      :host {
        display: block;
      }
    `
  ]
})
export class SingleMessageComponent {
  @Input() message!: Message;
  @Input() currentUserId!: string;
}

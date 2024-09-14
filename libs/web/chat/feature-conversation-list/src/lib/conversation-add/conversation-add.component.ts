import {Component, ChangeDetectionStrategy} from "@angular/core";
import {AsyncPipe, JsonPipe, NgClass} from "@angular/common";

@Component({
  selector: 'lib-conversation-add',
  templateUrl: './conversation-add.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, JsonPipe, AsyncPipe]
})
export class ConversationAddComponent {
}

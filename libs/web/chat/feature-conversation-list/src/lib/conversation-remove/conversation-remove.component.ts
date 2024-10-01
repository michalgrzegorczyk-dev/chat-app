import {AsyncPipe, JsonPipe, NgClass} from "@angular/common";
import {ChangeDetectionStrategy,Component} from "@angular/core";
import { ModalContentComponent } from '@chat-app/ui-modal';

@Component({
  selector: 'mg-conversation-remove',
  templateUrl: './conversation-remove.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, JsonPipe, AsyncPipe]
})
export class ConversationRemoveComponent implements ModalContentComponent{
}

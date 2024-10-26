import { AsyncPipe, JsonPipe, NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "mg-conversation-add",
  templateUrl: "./conversation-add.component.html",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, JsonPipe, AsyncPipe],
})
export class ConversationAddComponent {}

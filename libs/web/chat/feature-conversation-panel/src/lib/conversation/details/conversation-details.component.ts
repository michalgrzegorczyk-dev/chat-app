import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, OnInit, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Conversation } from "@chat-app/domain";
import { ButtonComponent } from "@chat-app/ui-button";
import { DropdownComponent } from "@chat-app/ui-dropdown";
import { InputComponent } from "@chat-app/ui-input";

@Component({
  selector: "mg-conversation-details",
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownComponent, ButtonComponent, InputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./conversation-details.component.html",
})
export class ConversationDetailsComponent implements OnInit {
  conversation = input<Conversation | null>();
  readonly detailsClosed = output<void>();
  readonly nameUpdated = output<string>();

  editedName = "";
  isMuted = false;
  searchQuery = "";

  ngOnInit() {
    const name = this.conversation()?.name;

    if (name) {
      this.editedName = name;
    }
  }

  updateConversationName() {
    if (this.editedName.trim()) {
      this.nameUpdated.emit(this.editedName.trim());
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  removeConversation() {}
}

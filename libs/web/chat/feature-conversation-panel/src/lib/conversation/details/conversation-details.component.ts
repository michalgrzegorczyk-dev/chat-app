import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent,ButtonRemoveComponent } from '@chat-app/ui-button';
import { UiDropdownComponent } from '@chat-app/ui-dropdown';

@Component({
  selector: 'mg-conversation-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonRemoveComponent, UiDropdownComponent, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './conversation-details.component.html',
})
export class ConversationDetailsComponent implements OnInit {
  readonly conversationName = input<string>('Conversation');
  readonly closeDetails = output<void>();

  editedName = '';
  isMuted = false;
  selectedTheme = 'System';
  searchQuery = '';

  themeOptions: Array<{ type: 'link' | 'button', text: string, href?: string }>  = [
    { type: 'button', text: 'Light' },
    { type: 'button', text: 'Dark' },
    { type: 'button', text: 'System' }
  ];

  ngOnInit() {
    this.editedName = this.conversationName();
  }

  updateConversationName() {
    // Implement logic to update conversation name
    console.log('Updating conversation name to:', this.editedName);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    // Implement logic to mute/unmute notifications
    console.log('Mute status:', this.isMuted);
  }

  onThemeSelect(item: any) {
    this.selectedTheme = item.text;
    // Implement logic to change theme
    console.log('Selected theme:', this.selectedTheme);
  }

  removeConversation() {
    // Implement logic to remove conversation
    console.log('Removing conversation');
  }
}

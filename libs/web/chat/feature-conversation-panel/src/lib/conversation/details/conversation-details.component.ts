import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonRemoveComponent } from '@chat-app/ui-button';

@Component({
  selector: 'mg-conversation-details',
  template: `
    <div class="flex w-96 flex-col border-l border-gray-200 h-full">
      <header class="h-16 bg-white shadow-sm px-6 flex justify-between items-center border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-800">Bob Details //make it defer</h2>
      </header>

      <div class="p-6">
        Details loading....

        <ul>
          <li>- Change name</li>
          <li>- Mute
            <button>Click</button>
          </li>
          <li>- Change theme</li>
          <li>- Search</li>
          <li class="flex">- Remove conversation
            <mg-button-remove></mg-button-remove>
          </li>
        </ul>
      </div>


    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonRemoveComponent
  ],
})
export class ConversationDetailsComponent {

}

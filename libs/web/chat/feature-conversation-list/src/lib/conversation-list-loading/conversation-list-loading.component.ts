import {ChangeDetectionStrategy, Component} from "@angular/core";

@Component({
  selector: 'mg-conversation-list-loading',
  standalone: true,
  template:
    `
      <ul class="overflow-y-auto flex-1 p-2">
        @for (item of [1,2,3,4,5]; track item) {
          <li class="flex items-center p-2 rounded-md mb-1 cursor-pointer transition-all duration-200 border-l-4 border-transparent animate-pulse">
            <div class="w-8 h-8 bg-gray-200 rounded-md mr-3"></div>
            <div class="flex-1 overflow-hidden">
              <div class="flex flex-col">
                <div class="flex items-center justify-between">
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div class="h-3 bg-gray-200 rounded w-3/4 mt-2"></div>
              </div>
            </div>
            <div class="w-6 h-6 bg-gray-200 rounded-md ml-2"></div>
          </li>
        }
      </ul>

      <div class="px-2 mt-2">
        <button class="w-full bg-gray-200 h-10 rounded-md animate-pulse"></button>
      </div>
    `,
    changeDetection : ChangeDetectionStrategy.OnPush
})
export class ConversationListLoadingComponent {
}

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "mg-conversation-list-loading",
  standalone: true,
  template: `
    <ul class="flex-1 overflow-y-auto p-2">
      @for (item of [1,2,3,4,5]; track item) {
      <li
        class="mb-1 flex animate-pulse cursor-pointer items-center rounded-md border-l-4 border-transparent p-2 transition-all duration-200"
      >
        <div class="mr-3 h-8 w-8 rounded-md bg-gray-200"></div>
        <div class="flex-1 overflow-hidden">
          <div class="flex flex-col">
            <div class="flex items-center justify-between">
              <div class="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
            <div class="mt-2 h-3 w-3/4 rounded bg-gray-200"></div>
          </div>
        </div>
        <div class="ml-2 h-6 w-6 rounded-md bg-gray-200"></div>
      </li>
      }
    </ul>

    <div class="mt-2 px-2">
      <button class="h-10 w-full animate-pulse rounded-md bg-gray-200"></button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListLoadingComponent {}

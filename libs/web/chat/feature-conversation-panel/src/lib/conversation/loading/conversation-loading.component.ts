import { NgClass, NgForOf } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "mg-conversation-loading",
  standalone: true,
  templateUrl: "./conversation-loading.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgForOf, NgClass],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
})
export class ConversationLoadingComponent {}

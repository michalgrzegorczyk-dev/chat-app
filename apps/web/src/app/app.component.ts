import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotifierContainerComponent } from '@chat-app/ui-notifier';

@Component({
  standalone: true,
  imports: [RouterModule, NotifierContainerComponent],
  selector: 'mg-root',
  template: `
    <router-outlet />
    <notifier-container />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

}

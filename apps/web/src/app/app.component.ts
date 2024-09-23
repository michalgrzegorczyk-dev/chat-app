import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { NotifierModule, NotifierService } from 'angular-notifier';

@Component({
  standalone: true,
  imports: [RouterModule, NotifierModule],
  selector: 'mg-root',
  template: `
    <router-outlet />
    <notifier-container />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}

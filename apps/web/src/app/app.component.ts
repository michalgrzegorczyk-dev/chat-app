import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'mg-root',
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}

import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  template: '<router-outlet />',
  // nie jestem pewien czy tutaj powinno byc OnPush, to jest app component i masz router outlet
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}

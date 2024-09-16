import { Component, ChangeDetectionStrategy, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { NgFor, NgIf, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountWidgetComponent, AccountListComponent } from '@chat-app/feature-account';
import { User } from '@chat-app/domain';
import { Router } from '@angular/router';
import { AuthService } from '@chat-app/util-auth';
import { first } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ROUTES } from '../../app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [NgFor, NgIf, FormsModule, JsonPipe, AccountWidgetComponent, AccountListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  // to samo, a szybciej
  users = toSignal(this.authService.getAllUsers());
  // readonly users = signal<User[]>([]);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  async onSelectUser(user: User): Promise<void> {
    this.authService.setUser(user);
    // uzywajac routes nie powinienes wiedziec czy musisz dodac / na poczatku/koncu
    // lepszym rozwiazaneim jest uzycie obiektu, ktory zwraca funkcje, np routes.chat.url() -> taka funkcja zwroci route z /
    await this.router.navigate([`/${ROUTES.CHAT}`]);
  }
}

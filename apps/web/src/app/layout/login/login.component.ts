import { Component, ChangeDetectionStrategy, OnInit, signal, inject, DestroyRef } from '@angular/core';
import { NgFor, NgIf, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountComponent, AccountListComponent } from '@chat-app/feature-account';
import { User } from '@chat-app/domain';
import { Router } from '@angular/router';
import { AuthService } from '@chat-app/util-auth';
import { first } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ROUTES } from '../../app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [NgFor, NgIf, FormsModule, JsonPipe, AccountComponent, AccountListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  readonly users = signal<User[]>([]);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.authService.getAllUsers().pipe(
      first(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((response: User[]) => {
      this.users.set(response);
    });
  }

  async onSelectUser(user: User): Promise<void> {
    this.authService.setUser(user);
    await this.router.navigate([`/${ROUTES.CHAT}`]);
  }
}

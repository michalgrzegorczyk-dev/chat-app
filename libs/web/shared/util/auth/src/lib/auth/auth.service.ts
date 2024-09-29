import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { UserDto } from '@chat-app/dtos';
import { User } from '@chat-app/domain';
import { routing } from '@chat-app/util-routing';
import { ENVIRONMENT } from '@chat-app/environment';

const USER_PLACEHOLDER = {
  id: '',
  avatarUrl: '',
  name: '',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly user = signal<User>(USER_PLACEHOLDER);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly environment = inject(ENVIRONMENT);

  setUser(user: User) {
    this.user.update(() => user);
  }

  isUserLoggedIn() {
    return (
      this.user().id !== USER_PLACEHOLDER.id &&
      this.user().avatarUrl !== USER_PLACEHOLDER.avatarUrl &&
      this.user().name !== USER_PLACEHOLDER.name
    );
  }

  async logOut(): Promise<void> {
    this.setUser(USER_PLACEHOLDER);
    await this.router.navigate([routing.auth.url()]);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<UserDto[]>(`${this.environment.apiUrl}/chat/users`).pipe(
      map((response: UserDto[] | null) => {
        if (!response) {
          throw new Error('No users found. Please create Table users in your Supabase instance.');
        }
        return response.map((userDto: UserDto) => {
          return {
            ...userDto,
            avatarUrl: userDto.profile_photo_url,
          };
        });
      })
    );
  }
}

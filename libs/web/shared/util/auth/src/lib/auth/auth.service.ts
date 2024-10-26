import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { UserDto } from "@chat-app/dtos";
import { ENVIRONMENT } from "@chat-app/environment";
import { routes } from "@chat-app/util-routing";
import { map, Observable } from "rxjs";
import { User } from "./user.type";

const USER_PLACEHOLDER = {
  id: "",
  avatarUrl: "",
  name: "",
};

@Injectable({
  providedIn: "root",
})
export class AuthService {
  readonly user = signal<User>(USER_PLACEHOLDER);
  readonly #router = inject(Router);
  readonly #http = inject(HttpClient);
  readonly #environment = inject(ENVIRONMENT);

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
    await this.#router.navigate([routes.auth.url()]);
  }

  // from chat
  getAllUsers(): Observable<User[]> {
    return this.#http
      .get<UserDto[]>(`${this.#environment.apiUrl}${routes.chat.users.url()}`)
      .pipe(
        map((response: UserDto[] | null) => {
          if (!response) {
            throw new Error(
              "No users found. Please create Table users in your Supabase instance.",
            );
          }
          return response.map((userDto: UserDto) => {
            return {
              ...userDto,
              avatarUrl: userDto.profile_photo_url,
            };
          });
        }),
      );
  }
}

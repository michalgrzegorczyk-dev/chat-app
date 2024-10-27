import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
// eslint-disable-next-line
import { routes } from "@chat-app/util-routing";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { User } from "./user.type";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user = signal<User>({
    id: "",
    name: "",
    avatarUrl: "",
  });
  private readonly API_URL = "http://localhost:3000/auth";
  readonly #router = inject(Router);
  readonly #http = inject(HttpClient);

  isLoggedIn = computed(() => {
    const token = this.getToken();
    const userId = this.user().id;
    return !!token && !!userId;
  });

  login(username: string, password: string): Observable<any> {
    return this.#http.post(`${this.API_URL}/login`, { username, password }).pipe(
      // eslint-disable-next-line
      tap((response: any) => {
        localStorage.setItem("token", response.access_token);
        this.user.set({
          id: response.user.id,
          name: response.user.name,
          avatarUrl: response.user.profile_photo_url,
        });
      }),
    );
  }

  async logout(): Promise<void> {
    localStorage.removeItem("token");
    await this.#router.navigate([routes.auth.url()]);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }
}

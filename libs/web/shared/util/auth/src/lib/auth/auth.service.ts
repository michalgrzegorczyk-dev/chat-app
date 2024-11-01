import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { routes } from "@chat-app/util-routing";
import { BehaviorSubject, Observable, throwError, map } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { User } from "./user.type";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    profile_photo_url: string;
  };
}

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
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  readonly #router = inject(Router);
  readonly #http = inject(HttpClient);

  isLoggedIn = computed(() => {
    const token = this.getToken();
    const userId = this.user().id;
    return !!token && !!userId;
  });

  constructor() {
    // Restore user from localStorage if exists
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      this.user.set(JSON.parse(savedUser));
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.#http.post<AuthResponse>(`${this.API_URL}/login`, { username, password }).pipe(
      tap((response) => {
        console.log(response);
        this.storeTokens(response.access_token, response.refresh_token);
        this.user.set({
          id: response.user.id,
          name: response.user.name,
          avatarUrl: response.user.profile_photo_url,
        });
        localStorage.setItem("user", JSON.stringify(this.user()));
      }),
    );
  }

  refreshToken(): Observable<any> {
    return this.#http
      .post<any>(`${this.API_URL}/refresh`, {
        userId: this.user().id,
        refreshToken: this.getRefreshToken(),
      })
      .pipe(
        tap((tokens) => {
          console.log("tokens from refresh", tokens);
          this.storeTokens(tokens.accessToken, tokens.refreshToken);
        }),
        map((tokens) => {
          return tokens;
        }),
        catchError((error) => {
          console.log("errr");
          return throwError(() => error);
        }),
      );
  }

  async logout(): Promise<void> {
    if (this.user().id) {
      try {
        await this.#http.post(`${this.API_URL}/logout`, {}).toPromise();
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
    this.clearTokens();
    this.user.set({ id: "", name: "", avatarUrl: "" });
    localStorage.removeItem("user");
    await this.#router.navigate([routes.auth.url()]);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refresh_token");
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    console.log("storing tokens", accessToken, refreshToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
  }
}

// auth.guard.ts
import { inject, Injectable } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { routes } from "@chat-app/util-routing";
import { Observable } from "rxjs";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  readonly #auth = inject(AuthService);
  readonly #router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.#auth.isLoggedIn()) {
      return true;
    }
    return this.#router.navigate([routes.auth.url()]);
  }
}

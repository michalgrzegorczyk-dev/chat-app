// auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { routes } from "@chat-app/util-routing";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

const isPublicRoute = (url: string): boolean => {
  return publicRoutes.some((route) => url.includes(route));
};

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip token handling for refresh and public routes
  if (request.url.includes("/auth/refresh") || isPublicRoute(request.url)) {
    return next(request);
  }

  // Add token if available
  const token = authService.getToken();
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !request.url.includes("/auth/refresh")) {
        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            // Clone the request and update the authorization header
            console.log("tokens here", tokens);
            const newRequest = request.clone({
              setHeaders: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            return next(newRequest);
          }),
          catchError((refreshError) => {
            console.error("Token refresh failed:", refreshError);
            authService.logout();
            router.navigate([routes.auth.url()]);
            return throwError(() => refreshError);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};

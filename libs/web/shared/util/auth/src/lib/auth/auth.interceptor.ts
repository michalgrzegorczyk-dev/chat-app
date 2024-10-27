import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";

import { AuthService } from "./auth.service";

const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password"];

const isPublicRoute = (url: string): boolean => {
  return publicRoutes.some((route) => url.includes(route));
};

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);

  if (isPublicRoute(request.url)) {
    return next(request);
  }

  const token = authService.getToken();

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request);
};

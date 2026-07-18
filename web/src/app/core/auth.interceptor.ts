import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  const token = authService.getAccessToken();
  const authorizedReq =
    isApiRequest && token && !isAuthEndpoint
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authorizedReq).pipe(
    catchError((error: unknown) => {
      const isUnauthorized = error instanceof HttpErrorResponse && error.status === 401;
      if (!isUnauthorized || !isApiRequest || isAuthEndpoint || !authService.getRefreshToken()) {
        return throwError(() => error);
      }
      return authService.refresh().pipe(
        switchMap(() => {
          const retriedReq = req.clone({
            setHeaders: { Authorization: `Bearer ${authService.getAccessToken()}` },
          });
          return next(retriedReq);
        }),
        catchError((refreshError: unknown) => {
          authService.logout();
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};

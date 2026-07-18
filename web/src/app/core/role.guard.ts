import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export function roleGuard(role: string): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.hasRole(role) ? true : router.createUrlTree(['/']);
  };
}

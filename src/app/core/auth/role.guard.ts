import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Role } from './auth.models';
import { AuthService } from './auth.service';

/**
 * UX-only guard for role-specific areas. The backend RolesGuard is the real
 * enforcement boundary for data and actions.
 */
export function roleGuard(allowed: readonly Role[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.hasRole(allowed) ? true : router.createUrlTree(['/home']);
  };
}

import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  finalize,
  Observable,
  shareReplay,
  switchMap,
  throwError,
} from 'rxjs';

import { AuthService } from './auth.service';
import { CSRF_HEADER, readCsrfToken } from './csrf';

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const SKIP_REFRESH = new HttpContextToken<boolean>(() => false);

let refreshInFlight: Observable<unknown> | null = null;

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const prepared = prepare(request);

  return next(prepared).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        prepared.context.get(SKIP_REFRESH) ||
        isAuthRequest(prepared.url)
      ) {
        return throwError(() => error);
      }

      refreshInFlight ??= auth.refresh().pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        finalize(() => {
          refreshInFlight = null;
        }),
      );

      return refreshInFlight.pipe(
        switchMap(() =>
          next(
            prepare(
              prepared.clone({
                context: prepared.context.set(SKIP_REFRESH, true),
              }),
            ),
          ),
        ),
        catchError((refreshError: unknown) => {
          auth.clearSession();
          void router.navigate(['/login'], {
            queryParams: { returnUrl: router.url },
          });
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};

function prepare(request: HttpRequest<unknown>): HttpRequest<unknown> {
  const csrfToken = UNSAFE_METHODS.has(request.method) ? readCsrfToken() : null;

  return request.clone({
    withCredentials: true,
    setHeaders: csrfToken ? { [CSRF_HEADER]: csrfToken } : {},
  });
}

function isAuthRequest(url: string): boolean {
  return /\/auth(?:\/|$|\?)/.test(url);
}

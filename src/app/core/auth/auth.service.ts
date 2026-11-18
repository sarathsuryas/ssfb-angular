import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { ApiService } from '../api/api.service';
import {
  AuthUser,
  ChangePasswordRequest,
  LoginRequest,
  Role,
} from './auth.models';

type AuthStatus = 'checking' | 'authenticated' | 'anonymous';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _status = signal<AuthStatus>('checking');

  readonly user = this._user.asReadonly();
  readonly status = this._status.asReadonly();
  readonly isAuthenticated = computed(() => this._status() === 'authenticated');
  readonly role = computed(() => this._user()?.role ?? null);

  /** Runs at bootstrap. Never rejects, so the app still starts if the API is down. */
  initialize(): Promise<void> {
    return new Promise((resolve) => {
      this.loadUser()
        .pipe(
          catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
              return this.refresh().pipe(
                catchError(() => {
                  this.clearSession();
                  return of(null);
                }),
              );
            }
            this.clearSession();
            return of(null);
          }),
        )
        .subscribe({
          next: () => resolve(),
          error: () => {
            this.clearSession();
            resolve();
          },
        });
    });
  }

  login(request: LoginRequest): Observable<AuthUser> {
    return this.api
      .post<{ user: AuthUser }>('/auth/login', request)
      .pipe(map(({ user }) => this.setSession(user)));
  }

  logout(): Observable<void> {
    return this.api.post<{ success: true }>('/auth/logout', {}).pipe(
      catchError(() => of(null)),
      tap(() => {
        this.clearSession();
        void this.router.navigate(['/login']);
      }),
      map((): void => undefined),
    );
  }

  refresh(): Observable<AuthUser> {
    return this.api
      .post<{ user: AuthUser }>('/auth/refresh', {})
      .pipe(map(({ user }) => this.setSession(user)));
  }

  changePassword(request: ChangePasswordRequest): Observable<AuthUser> {
    return this.api
      .post<{ user: AuthUser }>('/auth/change-password', request)
      .pipe(map(({ user }) => this.setSession(user)));
  }

  hasRole(roles: readonly Role[]): boolean {
    const role = this.role();
    return role !== null && roles.includes(role);
  }

  /** Called by the interceptor when a refresh fails or a session is rejected. */
  clearSession(): void {
    this._user.set(null);
    this._status.set('anonymous');
  }

  private loadUser(): Observable<AuthUser> {
    return this.api
      .get<{ user: AuthUser }>('/auth/me')
      .pipe(map(({ user }) => this.setSession(user)));
  }

  private setSession(user: AuthUser): AuthUser {
    this._user.set(user);
    this._status.set('authenticated');
    return user;
  }
}

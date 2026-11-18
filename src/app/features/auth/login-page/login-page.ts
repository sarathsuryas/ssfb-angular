import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { apiErrorMessage } from '@core/api/api-error';
import { ROLE_LANDING, Role } from '@core/auth/auth.models';
import { AuthService } from '@core/auth/auth.service';
import { AuthCard } from '@layout/auth-card/auth-card';

@Component({
  selector: 'app-login-page',
  imports: [AuthCard, ReactiveFormsModule],
  templateUrl: './login-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  readonly error = signal<string | null>(null);
  readonly submitting = signal(false);

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error.set(null);
    this.submitting.set(true);

    this.auth
      .login(this.form.getRawValue())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (user) => {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          void this.router.navigateByUrl(this.destination(returnUrl, user.role));
        },
        error: (error: unknown) => {
          this.error.set(apiErrorMessage(error, 'Unable to sign in'));
        },
      });
  }

  private destination(returnUrl: string | null, role: Role): string {
    if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    return ROLE_LANDING[role];
  }
}
